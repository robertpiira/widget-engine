/*jslint node: true*/

/**
 * This small script wraps script.js in order to allow registered widgets to have
 * their own dependencies, on demand.
 *
 * It will register itself as $we in the global namespace.
 *
 * @usage:
 *
 *    $we.register('mywidget', ['jQuery.js', 'underscore.js', 'mywidget.css'],
 *          function() {
 *            // widget logic in here with jQuery, underscore loaded and css
 *            // injected
 *            $we.loadFile(file, function(data) {
 *              // handler to load text-based files that return data, like json
 *              // and templates
 *            });
 *          });
 *
 * @examples:
 *  see the /example directory
 *
 */

'use strict';

(function() {

  /**
   * Main widget engine class
   * @constructor
   */
  var WidgetEngine = function() {
    this._widgets = {};
  };

  /**
   * Function to register a widget with the engine.
   * @param {string} widgetName Name the widget for reference.
   * @param {Array} widgetDependencies An array of dependencies (full paths).
   * @param {function} widgetLogicFn Callback function - when this fires, all
   *        dependencies will have been loaded.
   */
  WidgetEngine.prototype.register = function register(widgetName, widgetDependencies, widgetLogicFn) {

    this.name = widgetName;

    var i = 0,
      l = widgetDependencies.length,
      scriptDependencies = [],
      cssDependencies = [],
      engine = this;

    if (!this._widgets[widgetName]) {
      this._widgets[widgetName] = {
        dependencies: widgetDependencies
      };
    } else {
      // dependencies for this widget are already loaded/loading
      widgetLogicFn.call(engine);
    }

    for (;i<l;i++) {
      if (widgetDependencies[i].indexOf('.js') > -1) {
        scriptDependencies.push(widgetDependencies[i]);
      }
      if (widgetDependencies[i].indexOf('.css') > -1) {
        cssDependencies.push(widgetDependencies[i]);
      }
    }

    $script(scriptDependencies, function() {
      widgetLogicFn.call(engine);
    });

    if (cssDependencies.length) {
      this.injectCSS_(cssDependencies);
    }
  };

  /**
   * Utility to load files that return data from the widget.
   * @param {string} file A path to a file.
   * @param {function} fn A callback function.
   */
  WidgetEngine.prototype.loadFile = function render(file, fn)  {

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      fn(this.responseText);
    };
    xhr.open('get', file, true);
    xhr.send();

  };

  /**
   * Will inject css files in the header element.
   * @param {Array} cssDependencies An array of paths to css files.
   */
  WidgetEngine.prototype.injectCSS_ = function injectCSS(cssDependencies) {

    var i = 0, l = cssDependencies.length;
    var head = document.getElementsByTagName('head')[0];
    var tag = null;
    var t = null;

    for (;i<l;i++) {

      t = cssDependencies[i].split('/');

      if (!document.getElementById(t[t.length])) {
        tag = document.createElement('link');
        tag.setAttribute('href', cssDependencies[i]);
        tag.setAttribute('id',t[t.length]);
        tag.setAttribute('rel', 'stylesheet');
        tag.setAttribute('type', 'text/css');
        head.appendChild(tag);
      }
    }
  };

  /**
   * Utility to merge objects
   * @param {obj} base object.
   * @param {obj} the following (one or more) object(s) keys will be added to the base object.
   */
  WidgetEngine.prototype.extend = function (obj) {

    var args = [].slice.call(arguments, 1);
    var i = 0, l = args.length;

    for (;i<l;i++) {
      if (args[i]) {
        for (var prop in args[i]) {
          obj[prop] = args[i][prop];
        }
      }
    }

    return obj;

  };

  /**
   * Will create an OPTIONAL View Module for the widget
   * that gets bound to the widget wrapper DOM element.
   *
   * @usage:
   *
   *    var view = $we.View({
   *          initialize: function () {
   *            // init more methods.
   *            // initalize will fire directly when
   *            // the views.init method is triggered.
   *          },
   *          // ...what ever methods you'll need.
   *        });
   *
   *    // pass in the the widget wrapper
   *    // to the views boostrap method
   *    // to initialize the widget's view module
   *    view.boostrap({ el: domElement });
   *
   */
  WidgetEngine.prototype.View = function View(module) {

    var ViewModule = function (module) {

      WidgetEngine.prototype.extend(this, module);

      this.el = this.el || document.createElement('div');

      if (window && window.$) {
        this.$el = $(this.el);
        this.$ = function (selector) { return this.$el.find(selector); };
      }

      if (typeof this.initialize === 'function') {
        this.initialize();
      }

    };

    return {

      bootstrap: function (settings) {

        WidgetEngine.prototype.extend(module, settings);

        return new ViewModule(module);
      }

    };

  };

  /**
   * Exposes the WidgetEngine as a singleton on the global namespace.
   */
  if (window && !window.$we) {
    window.$we = new WidgetEngine();
  }

})();
