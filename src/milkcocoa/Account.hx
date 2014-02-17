package milkcocoa;

typedef Error = Null<String>;
typedef User = {id:String}

extern class Account {
	static public function signUp(email:String, secret:String, ?option:Dynamic, cb:Error->User->Void) : Void;
	static public function signIn(email:String, secret:String, cb:Error->User->Void) : Void;
	static public function getCurrentUser(cb:Error->User->Void) : Void;
	static public function signOut(cb:Bool->Void):Void;
}
