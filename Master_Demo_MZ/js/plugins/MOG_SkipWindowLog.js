//=============================================================================
// MOG_SkipWindowLog.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc (v1.0) Desativa a janela de Log.
 * @author Moghunter
 *
 * @param Lag Time
 * @desc Definição do tempo de espera após a ação.
 * @default 10
 * @type number
 *
 * @param Display Start Message
 * @desc Apresentar a menssagem inicial com os nomes dos inimigos.
 * @default false
 * @type boolean 
 *
 * @param Display Preemptive Message
 * @desc Apresentar a menssagem de ataque preventivo.
 * @default true
 * @type boolean 
 *
 * @help  
 * =============================================================================
 * +++ MOG - Skip Window Log (v1.0) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Desativa a janela de Log.
 *
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_SkipWindowLog = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_SkipWindowLog');
    Moghunter.winLogSpeed = Number(Moghunter.parameters['Lag Time'] || 10);
	Moghunter.battleStartMessage = String(Moghunter.parameters['Display Start Message'] || "false");
	Moghunter.battlePreemptiveMessage = String(Moghunter.parameters['Display Preemptive Message'] || "true");
	
//=============================================================================
// ■■■ Window BattleLog ■■■
//=============================================================================

//==============================
// ♦ OVERWRITE ♦ Refresh 
//==============================
Window_BattleLog.prototype.refresh = function() {
   this.visible = false;
};

//==============================
// ♦ OVERWRITE ♦ Message Speed
//==============================
Window_BattleLog.prototype.messageSpeed = function() {
	if (Imported.MOG_FlashDamage) {if ($gameTemp._flashDamage) {return 0}};
    return Moghunter.winLogSpeed;
};


//=============================================================================
// ■■■ Battle Manager ■■■
//=============================================================================

//==============================
// ♦ OVERWRITE ♦ Refresh 
//==============================
BattleManager.displayStartMessages = function() {
    if (String(Moghunter.battleStartMessage) === "true") {
		for (const name of $gameTroop.enemyNames()) {
			$gameMessage.add(TextManager.emerge.format(name));
		}
	};
	if (String(Moghunter.battlePreemptiveMessage) === "true") {
		if (this._preemptive) {
			$gameMessage.add(TextManager.preemptive.format($gameParty.name()));
		} else if (this._surprise) {
			$gameMessage.add(TextManager.surprise.format($gameParty.name()));
		}
	};
};