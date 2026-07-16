(function() {
    'use strict';
  
    function handleizeStr(str) {
      return String(str)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  
    function initProductTabs(sectionId) {
      var prodDesc = document.querySelector('.text-block');
      if (!prodDesc) return;
  
      var prodDescHtml = prodDesc.innerHTML;
      if (typeof prodDescHtml === 'undefined') return;
  
      var matchs = prodDescHtml.match(/<!-- TABS -->((.|[\r\n])+)<!-- \/TABS -->/m);
      if (matchs === null || matchs.length <= 1) return;
  
      var tabsWrapper = document.querySelector('.text-block');
      if (!tabsWrapper) return;
  
      tabsWrapper.innerHTML =
        '<ul class="resp-tabs-list pr-tab-' + sectionId + '"></ul>' +
        '<div class="resp-tabs-container pr-tab-' + sectionId + '"></div>';
  
      prodDesc.innerHTML = prodDescHtml.replace(
        /<!-- TABS -->((.|[\r\n])+)<!-- \/TABS -->/m,
        ''
      );
  
      var tabs = matchs[1].split('<h5>');
      var tabList = tabsWrapper.querySelector('.resp-tabs-list.pr-tab-' + sectionId);
      var tabContainer = tabsWrapper.querySelector('.resp-tabs-container.pr-tab-' + sectionId);
  
      tabs.forEach(function(v, i) {
        if (i === 0) return; // chunk before the first <h5>
  
        var info = v.split('</h5>');
        var title = info[0];
        var body = info[1];
        var id = handleizeStr(title);
  
        var li = document.createElement('li');
        li.id = id;
        li.innerHTML = title;
        tabList.appendChild(li);
  
        var panel = document.createElement('div');
        panel.innerHTML = body;
        tabContainer.appendChild(panel);
      });
  
      initResponsiveTabs(tabsWrapper, sectionId);
  
      if (window.location.hash !== '') {
        var thisUrlHash = window.location.hash;
        var selectedHash = '#' + thisUrlHash.split('#tab=')[1];
        var target = tabsWrapper.querySelector(selectedHash);
        if (target) target.click();
      }
    }
  
    // Minimal vanilla replacement for the easyResponsiveTabs jQuery plugin.
    function initResponsiveTabs(wrapper, sectionId) {
      var listItems = wrapper.querySelectorAll('.resp-tabs-list.pr-tab-' + sectionId + ' > li');
      var panels = wrapper.querySelectorAll('.resp-tabs-container.pr-tab-' + sectionId + ' > div');
  
      function activate(index) {
        listItems.forEach(function(li, i) {
          li.classList.toggle('resp-tab-active', i === index);
        });
        panels.forEach(function(panel, i) {
          panel.style.display = i === index ? 'block' : 'none';
          panel.classList.toggle('resp-tab-content-active', i === index);
        });
      }
  
      listItems.forEach(function(li, i) {
        li.addEventListener('click', function() {
          activate(i);
        });
      });
  
      if (listItems.length) activate(0);
    }
  
    function initSection(sectionElement) {
      var sectionId = sectionElement.dataset.sectionId;
      if (!sectionId) return;
      initProductTabs(sectionId);
    }
  
    // Initial page load — init every product-tabs section already in the DOM.
    document.addEventListener('DOMContentLoaded', function() {
      document
        .querySelectorAll('[data-section-type="product-tabs"]')
        .forEach(initSection);
    });
  
    // Theme editor: re-init when a merchant adds/reorders this section.
    document.addEventListener('shopify:section:load', function(event) {
      var section = event.target.querySelector('[data-section-type="product-tabs"]') || event.target;
      if (section.dataset && section.dataset.sectionType === 'product-tabs') {
        initSection(section);
      } else {
        var nested = event.target.querySelector('[data-section-type="product-tabs"]');
        if (nested) initSection(nested);
      }
    });
  
    // Theme editor: background/handle class toggle on section select.
    document.addEventListener('shopify:section:select', function(event) {
      var sectionId = event.detail.sectionId;
      var handle = document.getElementById('shopify-section-handle-' + sectionId);
      var handleClass = handle ? handle.getAttribute('data-bg-type') : null;
  
      if (handleClass) {
        event.target.classList.add(handleClass);
      }
    });
  })();