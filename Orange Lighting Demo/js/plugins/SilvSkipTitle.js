//=============================================================================
// SilvSkipTitle.js
// Version: 1.02
// License: Public Domain or CC0
//=============================================================================
/*:
 * @plugindesc v1.00 Skips Title Screen
   <SilverSkipTitle>
 * @author Silver
 *
 * @param Skip Title Screen Entirely
 * @desc Set to false to load the titlescreen briefly. true/false
 * @default true
 *
 * @param Skip If Savefile Present
 * @desc Skip the titlescreen if one or more savefiles are present? true/false
 * @default true
 *
 * @param FadeOut Title
 * @desc Only applies when SkipTitleScreenEntirely is set to false. true/false
 * @default false
 *
 * @help No credits required, modify as you see fit.
 */

(function()
{
// Get Plugin Parameters
var Silv = Silv || {};
Silv.Parameters = $plugins.filter(function(p) { return p.description.contains('<SilverSkipTitle>'); })[0].parameters;
Silv.SkipTitle = Silv.SkipTitle || {};
Silv.SkipTitle.SkipTitleScreenEntirely = Silv.Parameters['Skip Title Screen Entirely'].toLowerCase() == 'true';
Silv.SkipTitle.SkipIfSavefilePresent   = Silv.Parameters['Skip If Savefile Present'].toLowerCase() == 'true';
Silv.SkipTitle.FadeOutTitle            = Silv.Parameters['FadeOut Title'].toLowerCase() == 'true';

function ShowTitleScreen() { return DataManager.isAnySavefileExists() && !Silv.SkipTitle.SkipIfSavefilePresent; }

// Skipping the title screen entirely
var alias_methodSceneBootStart = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function()
{    
    if (Silv.SkipTitle.SkipTitleScreenEntirely && !ShowTitleScreen())
    {
        Scene_Base.prototype.start.call(this);
        SoundManager.preloadImportantSounds();
        if (DataManager.isBattleTest()) {
            DataManager.setupBattleTest();
            SceneManager.goto(Scene_Battle);
        } else if (DataManager.isEventTest()) {
            DataManager.setupEventTest();
            SceneManager.goto(Scene_Map);
        } else {
            this.checkPlayerLocation();
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Map);
        }
        this.updateDocumentTitle();
    }
    else
    {
        alias_methodSceneBootStart.apply(this, arguments);
    }
};

// Fading closing and optionally fading the titlescreen entirely.
var alias_method_SceneTitleStart = Scene_Title.prototype.start;
Scene_Title.prototype.start = function()
{
    if(ShowTitleScreen)
    {
        alias_method_SceneTitleStart.apply(this, arguments);
    }
    else // Skip title screen
    {
        DataManager.setupNewGame();
        this._commandWindow.close();

        if (Silv.SkipTitle.FadeOutTitle) { this.fadeOutAll(); }

        SceneManager.goto(Scene_Map);
    }
};
})();