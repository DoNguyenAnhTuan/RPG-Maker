'use strict';

//=============================================================================
// EISMapNamePlus                                                             
//=============================================================================

/*:
*
* @author Kino
* @plugindesc Adds new features to the map name window
*
* @param x
* @text Window X Position
* @desc The x position of the window.
* @type number
* @default 0
*
* @param y
* @text Window Y Position
* @desc The y position of the window.
* @type number
* @default 0
*
* @param Alignment
* @desc Alignment of the text within the window. Choices are 'left' or 'center'.
* @default center
*
* @param Animation
* @desc Whether the map name window stays visible, fades out, etc. Choices are 'persistent' or 'fade'
* @default persistent
*
* @param Marquee
* @desc Whether the text should scroll across the window. True or False (T/F)
* @default T
*
* @param Marquee Speed
* @desc Speed of the Marquee
* @default 1
* 
* @help
* version 1.1.0
* -Added x and y parameters to the plugin parameters.
//=============================================================================
//  Introduction                                                            
//=============================================================================
*
* This plugin adds more functionality to the map name window, allowing devs
* to make it a bit more fancy.
*
* Features Included:
* - Right to Left Marquee
* - Adjustable Marquee Speed
* - Persistent Map Name Box
* - Text Command Support
*
* Note: Centering doesn't work with  text marquees.
//=============================================================================
//  Contact Information
//=============================================================================
*
* Contact me via twitter: EISKino, or on the rpg maker forums.
* Username on forums: Kino.
*
* Forum Link: http://forums.rpgmakerweb.com/index.php?/profile/75879-kino/
* Twitter Link: https://twitter.com/EISKino
* Website: http://endlessillusoft.com/
*
* Hope this plugin helps, and enjoy!
* --Kino
*/

(function () {
  var params = PluginManager.parameters("EISMapNamePlus");
  var MapPlusParams = {
    xPos: parseInt(params['x']),
    yPos: parseInt(params['y']),
    alignment: params['Alignment'],
    animation: params['Animation'],
    marquee: params['Marquee'],
    marqueeSpeed: params['Marquee Speed']
  };

  function Setup() {
    'use strict';
    //=============================================================================
    //  Scene_Map
    //=============================================================================    

    var _WindowMapName_initialize = Window_MapName.prototype.initialize;
    Window_MapName.prototype.initialize = function () {
      _WindowMapName_initialize.call(this);
      this._marqueeSlide = MapPlusParams.marqueeSpeed;
      this._marqueePos = this.contentsWidth() - this.textWidth($gameMap.displayName()[0]);
      this._marqueeComplete = false;
      this.move(MapPlusParams.xPos, MapPlusParams.yPos, this.width, this.height);
    };

    Window_MapName.prototype.update = function () {
      Window_Base.prototype.update.call(this);
      if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
        this.updateFadeIn();
        this._showCount--;
      } else {
        if (/T/ig.test(MapPlusParams.marquee) && $gameMap.displayName()) this.updateMarquee();
        this.updateFadeOut();
      }
    };

    Window_MapName.prototype.refresh = function () {
      this.contents.clear();
      if ($gameMap.displayName()) {
        var width = this.contentsWidth();
        this.drawBackground(0, 0, width, this.lineHeight());
        var center = width / 2 - this.textWidth($gameMap.displayName()) / 2;
        var xPos = /center/ig.test(MapPlusParams.alignment) === true ? center : 0;
        if (!/T/ig.test(MapPlusParams.marquee)) this.drawTextEx($gameMap.displayName(), xPos, 0);
      }
    };

    var _WindowMapName_updateFadeOut = Window_MapName.prototype.updateFadeOut;
    Window_MapName.prototype.updateFadeOut = function () {
      if (!/persistent/ig.test(MapPlusParams.animation)) {
        if (/T/ig.test(MapPlusParams.marquee) && this._marqueeComplete) _WindowMapName_updateFadeOut.call(this);
      }
    };

    Window_MapName.prototype.updateMarquee = function () {
      this.contents.clear();
      var stopPoint = this.textWidth($gameMap.displayName()) * -1;
      if (this._marqueePos > stopPoint) this._marqueePos -= this._marqueeSlide;else {
        this._marqueePos = this.contentsWidth() - this.textWidth($gameMap.displayName()[0]);
        this._marqueeComplete = true;
      }
      this.drawTextEx($gameMap.displayName(), this._marqueePos, 0);
      this.drawBackground(0, 0, this.contentsWidth(), this.lineHeight());
    };
  }

  Setup();
})();