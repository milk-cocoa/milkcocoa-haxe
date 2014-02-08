package;

import milkcocoa.Account;
import milkcocoa.DataStore;
import MilkHelper;

class Sample{
	public static function main(){
		MilkHelper.pour_the_milk("localhost:3000","nobkz",init);
	}

	public static function init(){
		Account.signIn("nobukazu@bar.com","nobunobu",function(e, account){
				trace("signIn");
				trace(e);
				trace(account);
		});
	}
}