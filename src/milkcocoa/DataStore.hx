package milkcocoa;

typedef CallbackArg = {
	err : Int,
	path : String,
	id : String,
	value : Dynamic
}

extern class DataStore
{
	/**
	 * 送信
	 * @param	value	値
	 */
	public function send( value:Dynamic ):Void;

	/**
	 *
	 * @param	event	イベント名
	 */
	public function off( event:String ):Void;

	/**
	 *
	 * @param	event	イベント名
	 * @param	cb		コールバック関数
	 */
	public function on( event:String, ?cb:CallbackArg->Void ):Void;

	/**
	 * プッシュ
	 * @param	value		値
	 * @param	onComplete	完了時のコールバック関数
	 */
	public function push( value:Dynamic, ?onComplete:CallbackArg->Void ):Void;

	/**
	 * 削除
	 * @param	onComplete	完了時のコールバック関数
	 */
	public function remove( id : String ):Void;

	/**
	 *
	 * @param	value		値
	 * @param	onComplete	完了時のコールバック関数
	 */
	public function set( id : String, value:Dynamic ):Void;

	/**
	 * クエリ
	 * @param	query	？
	 * @return	クエリ
	 */
	public function query( query:Dynamic ):Query;

	/**
	 * 取得
	 * @param	cb	コールバック関数
	 */
	public function get( ?cb:Dynamic->Void ):Void;

	/**
	 * パス取得
	 * @return	パス文字列
	 */
	public function getPath( ):String;

	/**
	 * 親パス取得
	 * @return	パス文字列
	 */
	public function parent( ):String;

	/**
	 * 子供取得
	 * @param	query	子供の名前
	 * @return	子供のデータストア
	 */
	public function child( path:String ):DataStore;

	/**
	 * ルート取得
	 * @return	ルートのデータストア
	 */
	public function root( ):DataStore;
}
