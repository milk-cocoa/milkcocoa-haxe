package milkcocoa;

extern class Query {
	public function new(?params:Dynamic):Void;
	public function limit(n:Int):Query;
	public function sort(attr:String):Query;
	public function done(cb:Dynamic->Void):Void;
}