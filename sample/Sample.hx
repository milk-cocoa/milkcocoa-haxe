package;

import milkcocoa.Account;
import milkcocoa.DataStore;

@:expose
class Sample{
	public static function main(){
		//Account.signUp("nobukazu@bar.com","nobunobu",{},function(e){
			//trace("signUp");
			//trace(e);
			Account.signIn("nobukazu@bar.com","nobunobu",function(e, account){
				trace("signIn");
				trace(e);
				trace(account);
				});
			//});
	}
}