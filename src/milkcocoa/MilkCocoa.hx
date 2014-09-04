package milkcocoa;

@:native("MilkCocoa") extern class MilkCocoa
{
	/**
	 * コンストラクタ
	 * @param	host	ホスト
	 * @param	cb		コールバック関数
	 */
	public function new( host:String ):Void;

	/**
	 * サインアップ
	 * @param	email	メールアドレス
	 * @param	password	シークレットキー
	 * @param	option	？
	 * @param	cb		コールバック関数
	 */
	public function addAccount( email:String,password:String, option:Dynamic, cb:Dynamic->Dynamic->Void ):Void;

	/**
	 * サインイン
	 * @param	email	メールアドレス
	 * @param	secret	シークレットキー
	 * @param	cb		コールバック関数
	 */
	public function login( email:String, secret:String, cb:Dynamic->Dynamic->Void ):Void;

	/**
	 * サインアウト
	 * @param	cb	コールバック関数
	 */
	public function logout( ?cb:Dynamic->Void ):Void;

	/**
	 * ユーザーリスト取得
	 * @param	cb	コールバック関数
	 */
	public function getCurrentUser( cb:Dynamic->Dynamic->Void ):Void;

	/**
	 * データストア
	 * @param	path	パスへの文字列
	 */
	public function dataStore( path:String ):DataStore;
}
