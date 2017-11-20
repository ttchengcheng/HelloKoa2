export default () =>
`<form id="fileform" method="post" enctype="multipart/form-data">
  <div class="file has-name is-fullwidth">
    <label class="file-label">
      <input type="file" id="file" name="file" multiple="multiple" class="file-input" />
      <span class="file-cta"><span class="file-icon">
        <i class="fa fa-upload" /i>
      </span>
      <span class="file-label">Choose a file…</span>
      <span id="filename" class="file-name">0 file(s) selected</span>
      <button type="submit" class="ui fluid large teal button">Upload</button>
    </label>
  </div>
</form>
<table class="table is-fullwidth is-hoverable">
  <tbody id="filelist"></tbody>
</table>` &&
`
<script src="javascripts/jquery.min.js" />
<script src="javascripts/upload.js" />
<script >window.uploader.init();</script>
`
