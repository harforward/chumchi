/* ============================================
   CHUMCHI — supabase.js
   Single source of truth for Supabase client.
   Include before app.js on every page.
   ============================================ */

const SUPABASE_URL = 'https://lfrlzqqyxivdexiugdhv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J2DYK18vReSKbFwoMEr4FA_m6Jqp1Ms';

// Load Supabase SDK from CDN then initialise
const _sbScript = document.createElement('script');
_sbScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
_sbScript.onload = () => {
  window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  document.dispatchEvent(new Event('sb:ready'));
};
document.head.appendChild(_sbScript);

// Helper: wait for sb to be ready
function sbReady(fn) {
  if (window.sb) { fn(); }
  else { document.addEventListener('sb:ready', fn, { once: true }); }
}

// ── DB helpers ─────────────────────────────

async function dbGetRecipes(familyId) {
  const { data, error } = await window.sb
    .from('recipes')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false });
  if (error) { console.error('dbGetRecipes:', error); return []; }
  return data;
}

async function dbGetMemberRecipes(memberId) {
  const { data, error } = await window.sb
    .from('recipes')
    .select('*')
    .eq('assigned_to', memberId)
    .order('created_at', { ascending: false });
  if (error) { console.error('dbGetMemberRecipes:', error); return []; }
  return data;
}

async function dbSaveRecipe(recipe) {
  // Map our local format to DB columns
  const row = {
    family_id:   recipe.familyId   || 'rafiq',
    title:       recipe.title,
    ingredients: recipe.ingredients,
    steps:       recipe.steps,
    tags:        recipe.tags        || [],
    assigned_to: recipe.assignedTo,
    uploaded_by: recipe.uploadedBy,
    raw_note:    recipe.rawNote     || '',
    image_url:   recipe.imageUrl    || null,
  };
  const { data, error } = await window.sb
    .from('recipes')
    .insert([row])
    .select()
    .single();
  if (error) { console.error('dbSaveRecipe:', error); return null; }
  return data;
}

async function dbMoveRecipe(recipeId, newMemberId) {
  const { error } = await window.sb
    .from('recipes')
    .update({ assigned_to: newMemberId, updated_at: new Date().toISOString() })
    .eq('id', recipeId);
  if (error) { console.error('dbMoveRecipe:', error); return false; }
  return true;
}

async function dbDeleteRecipe(recipeId) {
  const { error } = await window.sb
    .from('recipes')
    .delete()
    .eq('id', recipeId);
  if (error) { console.error('dbDeleteRecipe:', error); return false; }
  return true;
}

async function dbGetMembers(familyId) {
  const { data, error } = await window.sb
    .from('members')
    .select('*')
    .eq('family_id', familyId)
    .order('generation', { ascending: true });
  if (error) { console.error('dbGetMembers:', error); return []; }
  return data;
}

async function dbLoginMember(familyId, username, password) {
  const { data, error } = await window.sb
    .from('members')
    .select('*')
    .eq('family_id', familyId)
    .eq('username', username)
    .eq('password', password)
    .single();
  if (error || !data) return null;
  return data;
}

async function dbSaveRequest(request) {
  const row = {
    type:       request.type,
    first_name: request.first,
    last_name:  request.last,
    family_id:  request.family || null,
    relation:   request.relation || null,
    email:      request.email || null,
    note:       request.note || null,
    status:     'pending',
  };
  const { data, error } = await window.sb
    .from('access_requests')
    .insert([row])
    .select()
    .single();
  if (error) { console.error('dbSaveRequest:', error); return null; }
  return data;
}

async function dbGetRequests() {
  const { data, error } = await window.sb
    .from('access_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('dbGetRequests:', error); return []; }
  return data;
}

async function dbUpdateRequestStatus(id, status) {
  const { error } = await window.sb
    .from('access_requests')
    .update({ status })
    .eq('id', id);
  return !error;
}

async function dbUploadImage(file, path) {
  const { data, error } = await window.sb.storage
    .from('recipe-images')
    .upload(path, file, { upsert: true });
  if (error) { console.error('dbUploadImage:', error); return null; }
  const { data: urlData } = window.sb.storage
    .from('recipe-images')
    .getPublicUrl(path);
  return urlData?.publicUrl || null;
}

// Normalise DB recipe row → app format
function normaliseRecipe(row) {
  return {
    id:          row.id,
    title:       row.title,
    ingredients: row.ingredients || [],
    steps:       row.steps       || [],
    tags:        row.tags        || [],
    assignedTo:  row.assigned_to,
    uploadedBy:  row.uploaded_by,
    rawNote:     row.raw_note    || '',
    imageUrl:    row.image_url   || null,
    uploadDate:  row.created_at  ? row.created_at.split('T')[0] : '',
    familyId:    row.family_id,
  };
}

// ── Extended DB helpers for approval workflow ──

async function dbSaveRecipePending(recipe) {
  const row = {
    family_id:   recipe.familyId || 'rafiq',
    title:       recipe.title,
    ingredients: recipe.ingredients,
    steps:       recipe.steps,
    tags:        recipe.tags || [],
    assigned_to: recipe.assignedTo,
    uploaded_by: recipe.uploadedBy,
    raw_note:    recipe.rawNote || '',
    image_url:   recipe.imageUrl || null,
    status:      'pending',
  };
  const { data, error } = await window.sb
    .from('recipes')
    .insert([row])
    .select()
    .single();
  if (error) { console.error('dbSaveRecipePending:', error); return null; }
  return data;
}

async function dbRequestMove(recipeId, fromMember, toMember, requestedBy) {
  // Store move request in access_requests table
  const row = {
    type:       'move_recipe',
    family_id:  fromMember,
    relation:   toMember,
    note:       recipeId,
    email:      requestedBy,
    status:     'pending',
  };
  const { data, error } = await window.sb
    .from('access_requests')
    .insert([row])
    .select()
    .single();
  if (error) { console.error('dbRequestMove:', error); return null; }
  return data;
}

async function dbApproveRecipe(recipeId) {
  const { error } = await window.sb
    .from('recipes')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', recipeId);
  return !error;
}

async function dbRejectRecipe(recipeId) {
  const { error } = await window.sb
    .from('recipes')
    .delete()
    .eq('id', recipeId);
  return !error;
}

async function dbGetPendingRecipes(familyId) {
  const { data, error } = await window.sb
    .from('recipes')
    .select('*')
    .eq('family_id', familyId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) { console.error('dbGetPendingRecipes:', error); return []; }
  return data;
}

async function dbGetApprovedRecipes(memberId) {
  const { data, error } = await window.sb
    .from('recipes')
    .select('*')
    .eq('assigned_to', memberId)
    .in('status', ['approved', null])
    .order('created_at', { ascending: false });
  // fallback: if status column not yet filtered, return all
  if (error) {
    const { data: all } = await window.sb
      .from('recipes').select('*').eq('assigned_to', memberId)
      .order('created_at', { ascending: false });
    return all || [];
  }
  return data;
}

async function dbGetAllFamilyRecipes(familyId) {
  const { data, error } = await window.sb
    .from('recipes')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false });
  if (error) { console.error('dbGetAllFamilyRecipes:', error); return []; }
  return data;
}

async function dbAddMember(member) {
  const row = {
    id:        member.username.toLowerCase().replace(/\s/g,'_') + '_' + Date.now(),
    family_id: member.familyId,
    name:      member.name,
    role:      member.role,
    generation: member.generation || 2,
    username:  member.username.toLowerCase(),
    password:  member.password,
  };
  const { data, error } = await window.sb
    .from('members')
    .insert([row])
    .select()
    .single();
  if (error) { console.error('dbAddMember:', error); return null; }
  return data;
}

async function dbGetPendingCount(familyId) {
  const { count } = await window.sb
    .from('recipes')
    .select('*', { count: 'exact', head: true })
    .eq('family_id', familyId)
    .eq('status', 'pending');
  const { count: reqCount } = await window.sb
    .from('access_requests')
    .select('*', { count: 'exact', head: true })
    .eq('family_id', familyId)
    .eq('status', 'pending');
  return (count || 0) + (reqCount || 0);
}

async function dbGetAllMemberRecipes(memberId) {
  // Returns all recipes assigned to member — both pending and approved
  // Member sees their own pending; others see only approved
  const { data, error } = await window.sb
    .from('recipes')
    .select('*')
    .eq('assigned_to', memberId)
    .order('created_at', { ascending: false });
  if (error) { console.error('dbGetAllMemberRecipes:', error); return []; }
  return data;
}
