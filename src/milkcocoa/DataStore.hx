package milkcocoa;

typedef Data = Dynamic;
typedef Result = Dynamic;
typedef Handler = Dynamic;
typedef IdObject = { id : String };

extern class DataStore {
	public function new(path:String, ?accessToken:String);
	public function root():DataStore;
	public function child(query:String):DataStore;
	public function parent():DataStore;
	public function getPath():String;
	public function get(id:String, cb:DataStore->Result->Void) : Void;
	public function query(query:Dynamic) : Query;
	public function set(value:Dynamic, onComplete:IdObject->Void):Void;
	public function remove(onComplete:Dynamic->Void):Void;
	public function push(value:Dynamic, onComplete:Dynamic->Void):Void;
	public function on(event:String, cb:Handler->Void):Void;
	public function off(event:String):Void;
}
