(function () {
  'use strict';

  /* ---------- OS detection & tabs ---------- */
  function detectOS() {
    try {
      if (navigator.userAgentData && navigator.userAgentData.platform) {
        var p = navigator.userAgentData.platform.toLowerCase();
        if (p.indexOf('win') !== -1) return 'windows';
        if (p.indexOf('mac') !== -1 || p.indexOf('linux') !== -1) return 'linux';
      }
      var platform = (navigator.platform || '').toLowerCase();
      var ua = (navigator.userAgent || '').toLowerCase();
      if (platform.indexOf('win') !== -1 || ua.indexOf('windows') !== -1) {
        return 'windows';
      }
    } catch (e) {}
    return 'linux';
  }

  function switchTab(tab) {
    var btnId = 'btn-' + (tab === 'win' ? 'windows' : tab);
    var contentId = 'tab-' + (tab === 'win' ? 'windows' : tab);
    var targetBtn = document.getElementById(btnId);
    if (!targetBtn || targetBtn.classList.contains('active')) return;

    var btns = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    var contents = document.querySelectorAll('.tab-content');
    for (var j = 0; j < contents.length; j++) contents[j].classList.remove('active');

    targetBtn.classList.add('active');
    var targetContent = document.getElementById(contentId);
    if (targetContent) targetContent.classList.add('active');
  }

  var initialOS = detectOS();
  if (initialOS !== 'linux') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { switchTab(initialOS); });
    } else {
      switchTab(initialOS);
    }
  }

  /* ---------- Clipboard ---------- */
  function copyText(txt, btn) {
    function showSuccess() {
      if (btn && btn.classList.contains('copy-btn')) {
        var orig = btn.textContent || btn.innerText;
        btn.textContent = "[copied]";
        btn.style.background = "#fff";
        btn.style
