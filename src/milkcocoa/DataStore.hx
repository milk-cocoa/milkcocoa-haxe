package milkcocoa;


extern class DataStore {
	public function new(path:String, ?database_id:String, ?type:String, ?accessToken:String);
	public function root():DataStore; 
	public function child(query:String):DataStore;
	public function parent():DataStore;
	public function getType():String;
	public function getPath():String;
	public function find(id:String, cb:DataStore->Dynamic->Void):Void;
	public function findMany(point:Int, limit:Int, cb:DataStore->Dynamic->Void):Void;
	public function load(cb:DataStore->Dynamic->Void):Void;
	public function loadAsArray(cb:DataStore->Array<Dynamic>->Void):Void;
	public function add(key:String, attributes:Dynamic, onComplete:Dynamic->Void):Void;
	public function set(value:Dynamic, onComplete:Dynamic->Void):Void;
	public function unset(onComplete:Dynamic->Void):Void;
	public function push(value:Dynamic, onComplete:Dynamic->Void):Void;
	public function pop(key:String, cb:Dynamic->Void):Void;
	public function on(event:String, cb:Dynamic->Void):Void;
	public function off(event:String):Void;
}