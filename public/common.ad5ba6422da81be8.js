"use strict";(self.webpackChunkimperial=self.webpackChunkimperial||[]).push([[592],{5497:(v,p,r)=>{r.d(p,{a:()=>g});var s=r(5861),l=r(7066),e=r(2223),m=r(3144);let g=(()=>{class t extends l.D{constructor(c){var a;super(),a=this,this.http=c,this.createUser=function(){var i=(0,s.Z)(function*(o){return a.http.post(`${a.getApiUrl()}/users`,{...o},{headers:a.getHeaders()}).toPromise()});return function(o){return i.apply(this,arguments)}}(),this.updateUser=function(){var i=(0,s.Z)(function*(o,b){return a.http.patch(`${a.getApiUrl()}/users/${o}`,{...b},{headers:a.getHeaders()}).toPromise()});return function(o,b){return i.apply(this,arguments)}}(),this.findActives=(0,s.Z)(function*(i=null){return a.http.get(`${a.getApiUrl()}/users/clients?pagination=${JSON.stringify(i)}`,{headers:a.getHeaders()}).toPromise()})}}return t.\u0275fac=function(c){return new(c||t)(e.Y36(m.eN))},t.\u0275dir=e.lG2({type:t,features:[e.qOj]}),t.\u0275prov=e.Yz7({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()},8405:(v,p,r)=>{r.d(p,{W:()=>g});var s=r(5861),l=r(7066),e=r(2223),m=r(3144);let g=(()=>{class t extends l.D{constructor(c){var a;super(),a=this,this.http=c,this.createContract=function(){var i=(0,s.Z)(function*(o){return a.http.post(`${a.getApiUrl()}/contracts`,{...o},{headers:a.getHeaders()}).toPromise()});return function(o){return i.apply(this,arguments)}}(),this.loadContractData=(0,s.Z)(function*(i="undefined"){return a.http.get(`${a.getApiUrl()}/contracts/user/${i}`,{headers:a.getHeaders()}).toPromise()}),this.getPendingPaymentContracts=(0,s.Z)(function*(i=null){return a.http.get(`${a.getApiUrl()}/contracts/pending`,{headers:a.getHeaders()}).toPromise()})}}return t.\u0275fac=function(c){return new(c||t)(e.Y36(m.eN))},t.\u0275dir=e.lG2({type:t,features:[e.qOj]}),t.\u0275prov=e.Yz7({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()},6811:(v,p,r)=>{r.d(p,{M:()=>b});var s=r(2965),l=r(7579),e=r(2223),m=r(5580),g=r(4755),t=r(1576);function d(_,h){if(1&_){const n=e.EpF();e.TgZ(0,"webcam",19),e.NdJ("imageCapture",function(f){e.CHM(n);const x=e.oxw(2);return e.KtG(x.handleImage(f))}),e.qZA()}if(2&_){const n=e.oxw(2);e.Q6J("trigger",n.triggerObservable)("videoOptions",n.videoOptions)("imageQuality",1)}}function c(_,h){if(1&_&&(e.TgZ(0,"div",17),e.YNc(1,d,1,3,"webcam",18),e.qZA()),2&_){const n=e.oxw();e.xp6(1),e.Q6J("ngIf",n.showWebcam)}}function a(_,h){if(1&_&&(e.TgZ(0,"div",17),e._UZ(1,"img",20),e.qZA()),2&_){const n=e.oxw();e.xp6(1),e.Q6J("src",n.webcamImage.imageAsDataUrl,e.LSH)}}function i(_,h){if(1&_){const n=e.EpF();e.TgZ(0,"div",10)(1,"a",21),e.NdJ("click",function(){e.CHM(n);const f=e.oxw();return e.KtG(f.triggerSnapshot())}),e._UZ(2,"span",22),e.qZA()()}}function o(_,h){if(1&_){const n=e.EpF();e.TgZ(0,"div",10)(1,"a",21),e.NdJ("click",function(){e.CHM(n);const f=e.oxw();return e.KtG(f.reload())}),e._UZ(2,"span",23),e.qZA()()}}let b=(()=>{class _{constructor(n){this.matDialogRef=n,this.showWebcam=!0,this.allowCameraSwitch=!0,this.multipleWebcamsAvailable=!1,this.videoOptions={height:{ideal:1024},width:{ideal:576}},this.errors=[],this.trigger=new l.x,this.nextWebcam=new l.x,this.savePhoto=()=>{const u=this.webcamImage?.imageAsDataUrl;this.matDialogRef.close(u)},this.close=()=>{this.matDialogRef.close(!1)}}ngOnInit(){s.BF.getAvailableVideoInputs().then(n=>{this.multipleWebcamsAvailable=n&&n.length>1})}triggerSnapshot(){this.trigger.next()}reload(){this.webcamImage=null}toggleWebcam(){this.showWebcam=!this.showWebcam}handleInitError(n){this.errors.push(n)}showNextWebcam(n){this.nextWebcam.next(n)}handleImage(n){this.webcamImage=n}cameraWasSwitched(n){this.deviceId=n}get triggerObservable(){return this.trigger.asObservable()}get nextWebcamObservable(){return this.nextWebcam.asObservable()}}return _.\u0275fac=function(n){return new(n||_)(e.Y36(m.so))},_.\u0275cmp=e.Xpm({type:_,selectors:[["manage-camera"]],decls:22,vars:5,consts:[["id","camera",1,"dialog-content-wrapper","fixed-actions"],[1,"card",2,"height","inherit !important"],[1,"card-header"],[2,"font-size","calc(1.325rem + 0.9vw)"],[1,"card-body"],["fxLayout","column","fxLayoutAlign","center",1,"p-4",2,"height","100%"],["fxLayout","row","fxLayoutAlign","center",4,"ngIf"],[1,"card-footer"],["fxLayout","row","fxLayoutAlign","space-between"],[1,"col-3"],[1,"d-grid","gap-2"],[1,"btn","btn-success","btn-icon-text",3,"disabled","click"],[1,"feather","icon-save"],[1,"col-5"],["class","d-grid gap-2",4,"ngIf"],[1,"btn","btn-danger","btn-icon-text",3,"click"],[1,"feather","icon-x"],["fxLayout","row","fxLayoutAlign","center"],[3,"trigger","videoOptions","imageQuality","imageCapture",4,"ngIf"],[3,"trigger","videoOptions","imageQuality","imageCapture"],["alt","...",1,"card-img-top",3,"src"],["href","javascript:void(0)",1,"btn","btn-primary",3,"click"],[1,"feather","icon-aperture"],[1,"feather","icon-repeat"]],template:function(n,u){1&n&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"span",3),e._uU(4,"C\xe2mera"),e.qZA()(),e.TgZ(5,"div",4)(6,"div",5),e.YNc(7,c,2,1,"div",6),e.YNc(8,a,2,1,"div",6),e.qZA()(),e.TgZ(9,"div",7)(10,"div",8)(11,"div",9)(12,"div",10)(13,"button",11),e.NdJ("click",function(){return u.savePhoto()}),e._UZ(14,"span",12),e.qZA()()(),e.TgZ(15,"div",13),e.YNc(16,i,3,0,"div",14),e.YNc(17,o,3,0,"div",14),e.qZA(),e.TgZ(18,"div",9)(19,"div",10)(20,"button",15),e.NdJ("click",function(){return u.close()}),e._UZ(21,"span",16),e.qZA()()()()()()()),2&n&&(e.xp6(7),e.Q6J("ngIf",!u.webcamImage),e.xp6(1),e.Q6J("ngIf",u.webcamImage),e.xp6(5),e.Q6J("disabled",!u.webcamImage),e.xp6(3),e.Q6J("ngIf",!u.webcamImage),e.xp6(1),e.Q6J("ngIf",u.webcamImage))},dependencies:[g.O5,t.xw,t.Wh,s.i3],styles:[".mat-dialog-container{padding:0!important;overflow:hidden!important}manage-camera .fixed-actions{height:100%;display:flex;flex-direction:column}manage-camera .spacer{flex-grow:1}manage-camera .mat-dialog-content{height:auto;margin-bottom:0!important;max-height:initial!important}manage-camera .mat-dialog-actions{padding:6px;margin-bottom:0!important;background:#f7f7f7}manage-camera .mat-tab-body-content{overflow:visible!important;height:unset!important}manage-camera #app{text-align:center;color:#2c3e50;margin-top:60px}manage-camera #video{background-color:#fff}manage-camera #canvas{display:none}manage-camera li{display:inline;padding:5px}\n"],encapsulation:2}),_})()},2417:(v,p,r)=>{r.d(p,{T:()=>s});class s{constructor(e){this.getFullName=()=>`${this.firstName} ${this.paternalSurname}`,this.id=e.id||"",this.permission=e.permission||"",this.cpf=e.cpf||"",this.email=e.email||"",this.isLogged=e.isLogged||!1,this.role=e.role||"",this.gender=e.gender||"",this.fullname=e.fullname||"",this.firstName=e.firstName||"",this.secondName=e.secondName||"",this.paternalSurname=e.paternalSurname||"",this.maternalSurname=e.maternalSurname||"",this.birthDate=e.birthDate||"",this.profilePicture=e.profilePicture||"",this.addressPicture=e.addressPicture||"",this.residenceAddress=e.residenceAddress||"",this.billingAddress=e.billingAddress||"",this.phoneNumber=e.phoneNumber||""}}},4074:(v,p,r)=>{r.d(p,{C:()=>g});var s=r(5861),l=r(7066),e=r(2223),m=r(3144);let g=(()=>{class t extends l.D{constructor(c){var a;super(),a=this,this.http=c,this.createImage=function(){var i=(0,s.Z)(function*(o){return a.http.post(`${a.getApiUrl()}/images`,{...o},{headers:a.getHeaders()}).toPromise()});return function(o){return i.apply(this,arguments)}}()}}return t.\u0275fac=function(c){return new(c||t)(e.Y36(m.eN))},t.\u0275dir=e.lG2({type:t,features:[e.qOj]}),t.\u0275prov=e.Yz7({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()},5170:(v,p,r)=>{r.d(p,{G:()=>s});let s=(()=>{class l{}return l.deepClone=e=>JSON.parse(JSON.stringify(e)),l.randomValue=e=>{for(var m="",d=0;d<e;d++)m+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62*Math.random()));return m},l.isValidEmail=e=>new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(e),l})()},5861:(v,p,r)=>{function s(e,m,g,t,d,c,a){try{var i=e[c](a),o=i.value}catch(b){return void g(b)}i.done?m(o):Promise.resolve(o).then(t,d)}function l(e){return function(){var m=this,g=arguments;return new Promise(function(t,d){var c=e.apply(m,g);function a(o){s(c,t,d,a,i,"next",o)}function i(o){s(c,t,d,a,i,"throw",o)}a(void 0)})}}r.d(p,{Z:()=>l})}}]);