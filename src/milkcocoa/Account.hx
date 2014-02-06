package milkcocoa;

extern class Account{
	static public function sineUp(email:String, sercret:String,?option:Dynamic, cd:Dynamic -> Void) : Void;
	static public function signIn(email:String, secret:String, cb:Dynamic->DataStore->Void) : Void;
	static public function getCurrentUser(cb:Dynamic->DataStore->Void) : Void;
}