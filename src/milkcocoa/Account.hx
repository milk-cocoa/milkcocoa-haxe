package milkcocoa;


extern class Account{
	@:overload(function(email:String, sercret:String, cd:Dynamic -> Void) : Void{})
	static public function signUp(email:String, sercret:String,?option:Dynamic, cd:Dynamic -> Void) : Void;
	static public function signIn(email:String, secret:String, cb:Dynamic->DataStore->Void) : Void;
	static public function getCurrentUser(cb:Dynamic->DataStore->Void) : Void;
}