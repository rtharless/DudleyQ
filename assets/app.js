document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.product-description-tabs').forEach(function (tabsWrapper) {

      const tabs = tabsWrapper.querySelectorAll('.resp-tab-item');
      const contents = tabsWrapper.querySelectorAll('.resp-tab-content');

      // Initial state
      contents.forEach(function (content, index) {
          if (!content.classList.contains('resp-tab-content-active')) {
              content.style.display = 'none';
          } else {
              content.style.display = 'block';
          }
      });

      tabs.forEach(function (tab) {

          tab.addEventListener('click', function () {

              const tabIndex = this.dataset.tab;

              // Remove active class from tabs
              tabs.forEach(function (item) {
                  item.classList.remove('resp-tab-active');
              });

              // Hide all content
              contents.forEach(function (content) {
                  content.classList.remove('resp-tab-content-active');
                  content.style.display = 'none';
              });

              // Activate current tab
              this.classList.add('resp-tab-active');

              const activeContent = tabsWrapper.querySelector(
                  '.resp-tab-content[data-tab="' + tabIndex + '"]'
              );

              if (activeContent) {
                  activeContent.classList.add('resp-tab-content-active');
                  activeContent.style.display = 'block';
              }

          });

      });

  });

});