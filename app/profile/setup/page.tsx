// inside the form (in ProfileSetup page)
<div>
  <label className="text-sm font-medium">Profile Visibility</label>
  <select
    className="mt-2 block w-full rounded-md border px-3 py-2"
    value={form.visibility_mode}
    onChange={(e) => update("visibility_mode", e.target.value)}
  >
    <option value="public">Public (show name)</option>
    <option value="anonymous">Anonymous (hide name from employers)</option>
  </select>
  <p className="text-xs text-slate-500 mt-1">
    If anonymous, employers will see a generic candidate listing without your name or contact details.
  </p>
</div>
