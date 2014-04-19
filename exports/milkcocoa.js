(function(){
	
	var milfeeSocket = null;
	var mlkcca_local = {
		timestamp : null,
		id_header : null
	};
	function MilkCocoa(host, cb) {
		milfeeSocket = new MilfeeSocket(host, cb);
	}
	window.MilkCocoa = MilkCocoa;
	
	var eventnames = {
			callback : "a",
			push : "b",
			set : "c",
			remove : "d",
			send : "e"
	}
	
	MilkCocoa.prototype = {
			auth : function(token, cb) {
				var params = { token : token };
				milfeeSocket.send_and_callback("auth", params, function(data) {
					cb(data.err);
				});
			},
			signUp : function(email,secret,option,cb) {
				var params = {  email : email, secret : secret, option : option};
				milfeeSocket.send_and_callback("signup",params,function(data) {
					cb(data.err, data.user);
				});
			},
			signIn : function(email,secret,cb) {
				var params = {  email : email, secret : secret};
				milfeeSocket.send_and_callback("signin",params,function(data) {
					window.localStorage.setItem("mlkccasessionid",data.session);
					cb(data.err,data.user);
				});
			},
			signOut : function(cb) {
				var params = {  sessionid : window.localStorage.getItem("mlkccasessionid")};
				milfeeSocket.send_and_callback("signout",params,function(data) {
					cb(data.err);
				});
				window.localStorage.removeItem("mlkccasessionid");
			},
			getCurrentUser : function(cb) {
				var params = {  sessionid : window.localStorage.getItem("mlkccasessionid")};
				milfeeSocket.send_and_callback("getcurrentuser",params,function(data) {
					cb(data.err,data.user);
				});
			},
			dataStore : function(path) {
				return new DataStore(path);
			},
			DataStore : function(path) {
				return new DataStore(path);
			}
	}
	
	function DataStore(path) {
		this.path = pathutil.norm(path);
		this.data = null;
		this.accessToken = window.localStorage.getItem("mlkccasessionid");
	}
	
	DataStore.prototype = {
			send: function(value) {
				var params = { accessToken : this.accessToken,  path : this.path, value : value};
				milfeeSocket.send("send",params);
			},
			off: function(event) {
				milfeeSocket.off(event,this.path);
				var params = { accessToken : this.accessToken,  path : this.path, event : event};
				milfeeSocket.send("off",params);
			}
			,on: function(event,cb) {
				milfeeSocket.on(event,this.path,cb);
				var params = { accessToken : this.accessToken,  path : this.path, event : event};
				milfeeSocket.send("on",params);
			}
			,push: function(value, onComplete) {
				var id = milfeeSocket.idGenerator.getNextId();
				var params = { accessToken : this.accessToken,  path : this.path, value : value, id : id};
				milfeeSocket.send_and_callback("push",params,onComplete);
				return new DataStore(pathutil.norm(this.path + "/" + id), this.accessToken);
			}
			,remove: function(onComplete) {
				var params = { accessToken : this.accessToken,  path : this.path};
				milfeeSocket.send_and_callback("unset",params,onComplete);
			}
			,set: function(value,onComplete) {
				var params = { accessToken : this.accessToken,  path : this.path, value : value};
				milfeeSocket.send_and_callback("set",params,onComplete);
			}
			,query: function(query) {
				var params = { accessToken : this.accessToken,  path : this.path, query : query};
				return new Query(params);
			}
			,get: function(cb) {
				var params = { accessToken : this.accessToken,  path : this.path};
				milfeeSocket.send_and_callback("get",params,function(data) {
					cb(data);
				});
			}
			,getPath: function() {
				return this.path;
			}
			,parent: function() {
				return new DataStore(pathutil.parent(this.path), this.accessToken);
			}
			,child: function(query) {
				return new DataStore(pathutil.norm(this.path + "/" + query), this.accessToken);
			}
			,root: function() {
				return new DataStore("/",this.accessToken);
			}
	}
	function Query(params) {
		this.params = params;
		this.params.option = { };
	}
	Query.prototype = {
		done: function(cb) {
			milfeeSocket.send_and_callback("fm",this.params,function(data) {
				cb(data);
			});
		}
		,skip: function(skip) {
			this.params.option.skip = skip;
			return this;
		}
		,sort: function(attr) {
			this.params.option.sort = attr;
			return this;
		}
		,desort: function(attr) {
			this.params.option.desc = attr;
			return this;
		}
		,limit: function(n) {
			this.params.option.limit = n;
			return this;
		}
	}
	
	
	function MilfeeSocket(host, init_cb) {
		var self = this;
		this.app_id = host.split('.')[0];
		this.callback_id = 0;
		this.callbacks = {};
		this.listeners = {
				push : {},
				set : {},
				remove : {},
				send : {}
		};
		this.host = host;
	    this.socket = io.connect(host, {
			'reconnect': true,
			'reconnection delay': 500,
			'max reconnection attempts': 10
		});
	    this.reconnect_count = 0;
	    this.queue = [];
	    this.mode = 'offline';	//online or offline
	    this.idGenerator = new IdGenerator();
		this.socket.on('connect', function() {
			console.log('connected');
			self.reconnect_count++;
			if(self.reconnect_count <= 1) {
				if(init_cb) init_cb(self);
			}
			self.socket.on('init', function(data) {
				self.idGenerator.init(data.ts);
				self.fire_operations();
			});
			self.socket.on(eventnames.callback, function(a) {
				var callbackid = "a" + String(a.callback_id);
				if(self.callbacks[callbackid]) {
					self.callbacks[callbackid](a.docs);
				}
			});
			self.socket.on(eventnames.push, function(a) {
				for(var i=0;i < self.listeners.push[a.sys.path].length;i++) {
					self.listeners.push[a.sys.path][i](a);
				}
			});
			self.socket.on(eventnames.set, function(a) {
				for(var i=0;i < self.listeners.set[a.sys.path].length;i++) {
					self.listeners.set[a.sys.path][i](a);
				}
			});
			self.socket.on(eventnames.remove, function(a) {
				for(var i=0;i < self.listeners.remove[a.sys.path].length;i++) {
					self.listeners.remove[a.sys.path][i](a);
				}
			});
			self.socket.on(eventnames.send, function(a) {
				for(var i=0;i < self.listeners.send[a.condition.path].length;i++) {
					self.listeners.send[a.condition.path][i](a);
				}
			});
		});
	}
	
	MilfeeSocket.prototype.getAppID = function() {
		return this.app_id;
	}
	
	MilfeeSocket.prototype.online = function() {
		if(this.mode == 'offline') {
			//切り替え
		}
	}

	MilfeeSocket.prototype.offline = function() {
		if(this.mode == 'online') {
			//切り替え
			this.fire_operations();
		}
	}

	MilfeeSocket.prototype.fire_operations = function() {
		var self = this;
		for(var i=0;i < self.queue.length;i++) {
			if(self.queue[i].method == "s") {
				self.send(self.queue[i].event, self.queue[i].packet);
			}else if(self.queue[i].method == "sac") {
				if(self.queue[i].event == 'push') {
					self.queue[i].packet.id = milfeeSocket.idGenerator.getNextId();
				}
				self.send_and_callback(self.queue[i].event, self.queue[i].packet, self.queue[i].cb);
			}
		}
		self.queue = [];
	}

	MilfeeSocket.prototype.on = function(event, path, listener) {
		if(!this.listeners[event].hasOwnProperty(path)) {
			this.listeners[event][path] = [];
		}
		this.listeners[event][path].push(listener);
	}
	MilfeeSocket.prototype.off = function(event, path) {
		this.listeners[event][path] = [];
	}
	MilfeeSocket.prototype.send = function(event, packet) {
		if(this.reconnect_count == 0) {
			this.queue.push({
				method : "s",
				event : event,
				packet : packet
			});
			return;
		}
		this.socket.emit(event, packet);
	}
	
	MilfeeSocket.prototype.send_and_callback = function(event, packet, cb) {
		if(this.reconnect_count == 0) {
			this.queue.push({
				method : "sac",
				event : event,
				packet : packet,
				cb : cb
			});
			return;
		}
		packet.callback_id = this.callback_id;
		this.callbacks["a" + String(this.callback_id)] = cb;
		this.socket.emit(event, packet);
		this.callback_id++;
	}
	
	var pathutil = {
			norm : function(path) {
				  var a = path.split('/');
				  var b = [];
				  for(var i=0;i < a.length;i++) {
				    if(a[i] != '') {
				      b.push(a[i]);
				    }
				  }
				  return b.join('/');
			},
			parent : function(path) {
				  var a = path.split('/');
				  a.pop();
				  return path(a.join('/'));
			}
	}

	var shuffle_table = 'ybfghijam6cpqdrw71nx34eo5suz0t9vkl28';
	function IdGenerator() {
		this.timestamp = new Date().getTime();
		this.id_header = this.getHeader(this.timestamp);
		this.prev_id = 0;
	}
	IdGenerator.prototype = {
		init : function(ts) {
			this.timestamp = ts;
			this.id_header = this.getHeader(this.timestamp);
		},
		getHeader : function(t) {
			return this.getHash(t) + shuffle_table[Math.floor(Math.random() * 36)] + shuffle_table[Math.floor(Math.random() * 36)];
		},
		getHash : function(time) {
			var h = '';
			var t = time;
			while(t > 0) {
				h += shuffle_table[t % 36];
				t = t/36;
				t = Math.floor(t);
			}
			return h;
		},
		getNextId : function() {
			this.prev_id++;
			return this.id_header + add04(this.getHash(this.prev_id));
			function add04(str) {
				var str2 = str;
				for(var i=0;i < 4-str.length;i++) {
					str2 = "0" + str2;
				}
		        return str2;
			}
		}
	}
}())