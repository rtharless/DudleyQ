(function () {
    'use strict';
  
    function slideUp(el, duration, callback) {
      el.style.overflow = 'hidden';
      el.style.height = el.offsetHeight + 'px';
      el.style.transitionProperty = 'height, margin, padding';
      el.style.transitionDuration = duration + 'ms';
      // force reflow so the transition picks up the starting height
      el.offsetHeight;
      el.style.height = '0px';
      el.style.paddingTop = '0px';
      el.style.paddingBottom = '0px';
      el.style.marginTop = '0px';
      el.style.marginBottom = '0px';
  
      window.setTimeout(function () {
        el.style.display = 'none';
        ['height', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'overflow', 'transition-duration', 'transition-property']
          .forEach(function (prop) { el.style.removeProperty(prop); });
        if (typeof callback === 'function') callback();
      }, duration);
    }
  
    function slideDown(el, duration) {
      el.style.removeProperty('display');
      var display = window.getComputedStyle(el).display;
      if (display === 'none') display = 'block';
      el.style.display = display;
  
      var targetHeight = el.offsetHeight;
      el.style.overflow = 'hidden';
      el.style.height = '0px';
      el.style.paddingTop = '0px';
      el.style.paddingBottom = '0px';
      el.style.marginTop = '0px';
      el.style.marginBottom = '0px';
      el.offsetHeight; // force reflow
      el.style.transitionProperty = 'height, margin, padding';
      el.style.transitionDuration = duration + 'ms';
      el.style.height = targetHeight + 'px';
      ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom'].forEach(function (prop) {
        el.style.removeProperty(prop);
      });
  
      window.setTimeout(function () {
        ['height', 'overflow', 'transition-duration', 'transition-property'].forEach(function (prop) {
          el.style.removeProperty(prop);
        });
      }, duration);
    }
  
    function trigger(el, eventName, detail) {
      el.dispatchEvent(new CustomEvent(eventName, { detail: detail, bubbles: true }));
    }
  
    function toNodeList(elements) {
      if (typeof elements === 'string') return Array.prototype.slice.call(document.querySelectorAll(elements));
      if (elements instanceof NodeList || Array.isArray(elements)) return Array.prototype.slice.call(elements);
      return [elements];
    }
  
    window.easyResponsiveTabs = function (elements, options) {
      var defaults = {
        type: 'default', // default, vertical, accordion
        width: 'auto',
        fit: true,
        closed: false,
        tabidentify: '',
        activetab_bg: 'white',
        inactive_bg: '#F5F5F5',
        active_border_color: '#c1c1c1',
        active_content_border_color: '#c1c1c1',
        activate: function () {}
      };
  
      var opt = Object.assign({}, defaults, options);
      var jtype = opt.type, jfit = opt.fit, jwidth = opt.width;
      var VERTICAL = 'vertical', ACCORDION = 'accordion';
      var hash = window.location.hash;
      var historyApi = !!(window.history && window.history.replaceState);
  
      if (document.querySelector('.template-featured-product')) {
        historyApi = false;
      }
  
      toNodeList(elements).forEach(function ($respTabs) {
        if (!$respTabs) return;
  
        $respTabs.addEventListener('tabactivate', function (e) {
          if (typeof opt.activate === 'function') {
            opt.activate.call(e.detail, e);
          }
        });
  
        var respTabsId = $respTabs.id;
        var $respTabsList = $respTabs.querySelector('ul.resp-tabs-list.' + opt.tabidentify);
  
        $respTabs.querySelectorAll('ul.resp-tabs-list.' + opt.tabidentify + ' li').forEach(function (li) {
          li.classList.add('resp-tab-item', opt.tabidentify);
        });
  
        $respTabs.style.display = 'block';
        $respTabs.style.width = jwidth;
  
        if (jtype === VERTICAL && $respTabsList) {
          $respTabsList.style.marginTop = '3px';
        }
  
        var $tabsContainer = $respTabs.querySelector('.resp-tabs-container.' + opt.tabidentify);
        if ($tabsContainer) $tabsContainer.style.borderColor = opt.active_content_border_color;
  
        $respTabs.querySelectorAll('.resp-tabs-container.' + opt.tabidentify + ' > div').forEach(function (div) {
          div.classList.add('resp-tab-content', opt.tabidentify);
        });
  
        (function jtabOptions() {
          if (jtype === VERTICAL) {
            $respTabs.classList.add('resp-vtabs', opt.tabidentify);
          }
          if (jfit === true) {
            $respTabs.style.width = '100%';
            $respTabs.style.margin = '0px';
          }
          if (jtype === ACCORDION) {
            $respTabs.classList.add('resp-easy-accordion', opt.tabidentify);
            if ($respTabsList) $respTabsList.style.display = 'none';
          }
        })();
  
        // Insert the accordion <h2> markup before each tab-content panel
        $respTabs.querySelectorAll('.resp-tab-content.' + opt.tabidentify).forEach(function (content) {
          var h2 = document.createElement('h2');
          h2.className = 'resp-accordion ' + opt.tabidentify;
          h2.setAttribute('role', 'tab');
          h2.innerHTML = '<span class="resp-arrow"></span>';
          h2.style.backgroundColor = opt.inactive_bg;
          h2.style.borderColor = opt.active_border_color;
          content.parentNode.insertBefore(h2, content);
        });
  
        var accordions = Array.prototype.slice.call($respTabs.querySelectorAll('.resp-accordion'));
        var tabItems = Array.prototype.slice.call($respTabs.querySelectorAll('.resp-tab-item'));
  
        accordions.forEach(function ($accItem, i) {
          var $tabItem = tabItems[i];
          if ($tabItem) {
            $accItem.innerHTML += $tabItem.innerHTML;
            Object.keys($tabItem.dataset || {}).forEach(function (key) {
              $accItem.dataset[key] = $tabItem.dataset[key];
            });
          }
          $accItem.setAttribute('aria-controls', opt.tabidentify + '_tab_item-' + i);
        });
  
        var tabContents = Array.prototype.slice.call($respTabs.querySelectorAll('.resp-tab-content.' + opt.tabidentify));
  
        tabItems.forEach(function ($tabItem, count) {
          $tabItem.setAttribute('aria-controls', opt.tabidentify + '_tab_item-' + count);
          $tabItem.setAttribute('role', 'tab');
          $tabItem.style.backgroundColor = opt.inactive_bg;
          $tabItem.style.borderColor = 'transparent';
        });
  
        tabContents.forEach(function ($tabContent, tabcount) {
          $tabContent.setAttribute('aria-labelledby', opt.tabidentify + '_tab_item-' + tabcount);
          $tabContent.style.borderColor = opt.active_border_color;
        });
  
        // Work out which tab should be active on load, based on the URL hash
        var tabNum = 0;
        var count = tabItems.length;
        if (hash !== '' && respTabsId) {
          var matches = hash.match(new RegExp(respTabsId + '([0-9]+)'));
          if (matches !== null && matches.length === 2) {
            tabNum = parseInt(matches[1], 10) - 1;
            if (tabNum > count) tabNum = 0;
          }
        }
  
        var activeTabItem = $respTabs.querySelectorAll('.resp-tab-item.' + opt.tabidentify)[tabNum];
        if (activeTabItem) {
          activeTabItem.classList.add('resp-tab-active');
          activeTabItem.style.backgroundColor = opt.activetab_bg;
          activeTabItem.style.borderColor = opt.active_border_color;
        }
  
        var respTabsListVisible = $respTabsList && $respTabsList.offsetParent !== null;
        var keepClosed = opt.closed === true ||
          (opt.closed === 'accordion' && !respTabsListVisible) ||
          (opt.closed === 'tabs' && respTabsListVisible);
  
        if (!keepClosed) {
          var activeAccordion = $respTabs.querySelectorAll('.resp-accordion.' + opt.tabidentify)[tabNum];
          if (activeAccordion) {
            activeAccordion.classList.add('resp-tab-active');
            activeAccordion.style.setProperty('background-color', opt.activetab_bg, 'important');
            activeAccordion.style.borderColor = opt.active_border_color;
            activeAccordion.style.background = 'none';
          }
          var activeContent = $respTabs.querySelectorAll('.resp-tab-content.' + opt.tabidentify)[tabNum];
          if (activeContent) {
            activeContent.classList.add('resp-tab-content-active', opt.tabidentify);
            activeContent.style.display = 'block';
          }
        }
  
        // Click handling — tabs and accordion toggling
        $respTabs.querySelectorAll('[role="tab"]').forEach(function ($currentTab) {
          $currentTab.addEventListener('click', function () {
            var tabAria = $currentTab.getAttribute('aria-controls');
  
            if ($currentTab.classList.contains('resp-accordion') && $currentTab.classList.contains('resp-tab-active')) {
              var openContent = $respTabs.querySelector('.resp-tab-content-active.' + opt.tabidentify);
              if (openContent) {
                slideUp(openContent, 200, function () {
                  openContent.classList.add('resp-accordion-closed');
                });
              }
              $currentTab.classList.remove('resp-tab-active');
              $currentTab.style.backgroundColor = opt.inactive_bg;
              $currentTab.style.borderColor = 'transparent';
              return;
            }
  
            if (!$currentTab.classList.contains('resp-tab-active') && $currentTab.classList.contains('resp-accordion')) {
              var prevActiveTab = $respTabs.querySelector('.resp-tab-active.' + opt.tabidentify);
              if (prevActiveTab) {
                prevActiveTab.classList.remove('resp-tab-active');
                prevActiveTab.style.backgroundColor = opt.inactive_bg;
                prevActiveTab.style.borderColor = 'transparent';
              }
              var prevContent = $respTabs.querySelector('.resp-tab-content-active.' + opt.tabidentify);
              if (prevContent) {
                slideUp(prevContent, 200, function () {
                  prevContent.classList.remove('resp-tab-content-active', 'resp-accordion-closed');
                });
              }
              $respTabs.querySelectorAll('[aria-controls="' + tabAria + '"]').forEach(function (el) {
                el.classList.add('resp-tab-active');
                el.style.backgroundColor = opt.activetab_bg;
                el.style.borderColor = opt.active_border_color;
              });
              var newContent = $respTabs.querySelector('.resp-tab-content[aria-labelledby="' + tabAria + '"].' + opt.tabidentify);
              if (newContent) {
                slideDown(newContent, 200);
                newContent.classList.add('resp-tab-content-active');
              }
            } else {
              var prevActiveTab2 = $respTabs.querySelector('.resp-tab-active.' + opt.tabidentify);
              if (prevActiveTab2) {
                prevActiveTab2.classList.remove('resp-tab-active');
                prevActiveTab2.style.backgroundColor = opt.inactive_bg;
                prevActiveTab2.style.borderColor = 'transparent';
              }
              var prevContent2 = $respTabs.querySelector('.resp-tab-content-active.' + opt.tabidentify);
              if (prevContent2) {
                prevContent2.removeAttribute('style');
                prevContent2.classList.remove('resp-tab-content-active', 'resp-accordion-closed');
              }
              $respTabs.querySelectorAll('[aria-controls="' + tabAria + '"]').forEach(function (el) {
                el.classList.add('resp-tab-active');
                el.style.backgroundColor = opt.activetab_bg;
                el.style.borderColor = opt.active_border_color;
              });
              var newContent2 = $respTabs.querySelector('.resp-tab-content[aria-labelledby="' + tabAria + '"].' + opt.tabidentify);
              if (newContent2) {
                newContent2.classList.add('resp-tab-content-active');
                newContent2.style.display = 'block';
              }
            }
  
            if (historyApi) {
              var currentHash = window.location.hash;
              var activeLi = $respTabs.querySelector('ul.resp-tabs-list li.resp-tab-active');
              var newHash = activeLi ? activeLi.id : '';
  
              if (currentHash !== '' && currentHash.indexOf(newHash) !== -1) {
                newHash = currentHash.replace(newHash, newHash);
              } else {
                newHash = '#tab=' + newHash;
              }
              window.history.replaceState(null, null, newHash);
            }
  
            trigger($currentTab, 'tabactivate', $currentTab);
          });
        });
  
        window.addEventListener('resize', function () {
          $respTabs.querySelectorAll('.resp-accordion-closed').forEach(function (el) {
            el.removeAttribute('style');
          });
        });
      });
    };
  })();