"use strict";(self.webpackChunkimperial=self.webpackChunkimperial||[]).push([[708],{8405:(v,g,i)=>{i.d(g,{W:()=>f});var t=i(5861),d=i(7066),s=i(2223),e=i(3144);let f=(()=>{class o extends d.D{constructor(m){var r;super(),r=this,this.http=m,this.createContract=function(){var l=(0,t.Z)(function*(h){return r.http.post(`${r.getApiUrl()}/contracts`,{...h},{headers:r.getHeaders()}).toPromise()});return function(h){return l.apply(this,arguments)}}(),this.cancelContract=function(){var l=(0,t.Z)(function*(h){return r.http.post(`${r.getApiUrl()}/contracts/cancel-contract`,{id:h},{headers:r.getHeaders()}).toPromise()});return function(h){return l.apply(this,arguments)}}(),this.loadContractData=(0,t.Z)(function*(l="undefined"){return r.http.get(`${r.getApiUrl()}/contracts/user/${l}`,{headers:r.getHeaders()}).toPromise()}),this.recalculateContractData=(0,t.Z)(function*(l="undefined"){return r.http.get(`${r.getApiUrl()}/contracts/recalculate/user/${l}`,{headers:r.getHeaders()}).toPromise()}),this.getPendingPaymentContracts=(0,t.Z)(function*(l=null){return r.http.get(`${r.getApiUrl()}/contracts/pending`,{headers:r.getHeaders()}).toPromise()}),this.contractsFromToday=(0,t.Z)(function*(){return r.http.get(`${r.getApiUrl()}/contracts/from-today`,{headers:r.getHeaders()}).toPromise()}),this.loadModalities=(0,t.Z)(function*(){return r.http.get(`${r.getApiUrl()}/modalities`,{headers:r.getHeaders()}).toPromise()})}}return o.\u0275fac=function(m){return new(m||o)(s.Y36(e.eN))},o.\u0275dir=s.lG2({type:o,features:[s.qOj]}),o.\u0275prov=s.Yz7({token:o,factory:o.\u0275fac,providedIn:"root"}),o})()},6811:(v,g,i)=>{i.d(g,{M:()=>x});var t=i(5861),d=i(2965),s=i(7579),e=i(2223),f=i(5580),o=i(4755),u=i(1576);function m(c,b){if(1&c){const a=e.EpF();e.TgZ(0,"webcam",20),e.NdJ("imageCapture",function(_){e.CHM(a);const p=e.oxw(2);return e.KtG(p.handleImage(_))})("cameraSwitched",function(_){e.CHM(a);const p=e.oxw(2);return e.KtG(p.cameraWasSwitched(_))})("initError",function(_){e.CHM(a);const p=e.oxw(2);return e.KtG(p.handleInitError(_))}),e.qZA()}if(2&c){const a=e.oxw(2);e.Q6J("width",a.width)("height",a.height)("trigger",a.triggerObservable)("allowCameraSwitch",a.allowCameraSwitch)("switchCamera",a.nextWebcamObservable)("videoOptions",a.videoOptions)("imageQuality",1)}}function r(c,b){if(1&c&&(e.TgZ(0,"div")(1,"div",18),e.YNc(2,m,1,7,"webcam",19),e.qZA()()),2&c){const a=e.oxw();e.xp6(2),e.Q6J("ngIf",a.showWebcam)}}function l(c,b){if(1&c&&(e.TgZ(0,"div",18),e._UZ(1,"img",21),e.qZA()),2&c){const a=e.oxw();e.xp6(1),e.Q6J("src",a.webcamImage.imageAsDataUrl,e.LSH)}}function h(c,b){if(1&c){const a=e.EpF();e.TgZ(0,"div",11)(1,"a",22),e.NdJ("click",function(){e.CHM(a);const _=e.oxw();return e.KtG(_.triggerSnapshot())}),e._UZ(2,"span",23),e.qZA()()}}function w(c,b){if(1&c){const a=e.EpF();e.TgZ(0,"div",11)(1,"a",22),e.NdJ("click",function(){e.CHM(a);const _=e.oxw();return e.KtG(_.reload())}),e._UZ(2,"span",24),e.qZA()()}}let x=(()=>{class c{constructor(a){var n=this;this.matDialogRef=a,this.width=0,this.height=0,this.showWebcam=!0,this.allowCameraSwitch=!0,this.multipleWebcamsAvailable=!1,this.videoOptions={},this.errors=[],this.trigger=new s.x,this.nextWebcam=new s.x,this.cameras=[],this.firstLoad=!1,this.ngOnInit=()=>{},this.cameraWasSwitched=function(){var p=(0,t.Z)(function*(C){n.firstLoad||(n.cameras=yield d.BF.getAvailableVideoInputs(),n.cameras&&n.cameras.length>1&&(n.multipleWebcamsAvailable=!0,n.showNextWebcam(C=n.cameras[n.cameras.length-1].deviceId)),n.firstLoad=!0),n.deviceId=C});return function(C){return p.apply(this,arguments)}}(),this.savePhoto=()=>{const p=this.webcamImage?.imageAsDataUrl;this.matDialogRef.close(p)},this.close=()=>{this.matDialogRef.close(!1)},this.width=.9*screen.width,this.height=this.width/(16/9),this.videoOptions={height:{ideal:this.height},width:{ideal:this.width}}}reload(){this.webcamImage=null}toggleWebcam(){this.showWebcam=!this.showWebcam}handleInitError(a){this.errors.push(a)}showNextWebcam(a){this.nextWebcam.next(a)}get triggerObservable(){return this.trigger.asObservable()}get nextWebcamObservable(){return this.nextWebcam.asObservable()}triggerSnapshot(){this.trigger.next()}handleImage(a){this.webcamImage=a}}return c.\u0275fac=function(a){return new(a||c)(e.Y36(f.so))},c.\u0275cmp=e.Xpm({type:c,selectors:[["manage-camera"]],decls:22,vars:5,consts:[["id","camera",1,"dialog-content-wrapper","fixed-actions"],[1,"card",2,"height","inherit !important"],[1,"card-header"],[2,"font-size","calc(1.325rem + 0.9vw)"],[1,"card-body"],["fxLayout","column","fxLayoutAlign","center",1,"p-4",2,"height","100%"],[4,"ngIf"],["fxLayout","row","fxLayoutAlign","center",4,"ngIf"],[1,"card-footer"],["fxLayout","row","fxLayoutAlign","space-between"],[1,"col-3"],[1,"d-grid","gap-2"],[1,"btn","btn-success","btn-icon-text",3,"disabled","click"],[1,"feather","icon-save"],[1,"col-5"],["class","d-grid gap-2",4,"ngIf"],[1,"btn","btn-danger","btn-icon-text",3,"click"],[1,"feather","icon-x"],["fxLayout","row","fxLayoutAlign","center"],[3,"width","height","trigger","allowCameraSwitch","switchCamera","videoOptions","imageQuality","imageCapture","cameraSwitched","initError",4,"ngIf"],[3,"width","height","trigger","allowCameraSwitch","switchCamera","videoOptions","imageQuality","imageCapture","cameraSwitched","initError"],["alt","Picture from camera",1,"card-img-top",3,"src"],["href","javascript:void(0)",1,"btn","btn-primary",3,"click"],[1,"feather","icon-aperture"],[1,"feather","icon-repeat"]],template:function(a,n){1&a&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"span",3),e._uU(4,"C\xe1mara"),e.qZA()(),e.TgZ(5,"div",4)(6,"div",5),e.YNc(7,r,3,1,"div",6),e.YNc(8,l,2,1,"div",7),e.qZA()(),e.TgZ(9,"div",8)(10,"div",9)(11,"div",10)(12,"div",11)(13,"button",12),e.NdJ("click",function(){return n.savePhoto()}),e._UZ(14,"span",13),e.qZA()()(),e.TgZ(15,"div",14),e.YNc(16,h,3,0,"div",15),e.YNc(17,w,3,0,"div",15),e.qZA(),e.TgZ(18,"div",10)(19,"div",11)(20,"button",16),e.NdJ("click",function(){return n.close()}),e._UZ(21,"span",17),e.qZA()()()()()()()),2&a&&(e.xp6(7),e.Q6J("ngIf",!n.webcamImage),e.xp6(1),e.Q6J("ngIf",n.webcamImage),e.xp6(5),e.Q6J("disabled",!n.webcamImage),e.xp6(3),e.Q6J("ngIf",!n.webcamImage),e.xp6(1),e.Q6J("ngIf",n.webcamImage))},dependencies:[o.O5,u.xw,u.Wh,d.i3],styles:[".mat-dialog-container{padding:0!important;overflow:hidden!important}manage-camera .fixed-actions{height:100%;display:flex;flex-direction:column}manage-camera .spacer{flex-grow:1}manage-camera .mat-dialog-content{height:auto;margin-bottom:0!important;max-height:initial!important}manage-camera .mat-dialog-actions{padding:6px;margin-bottom:0!important;background:#f7f7f7}manage-camera .mat-tab-body-content{overflow:visible!important;height:unset!important}manage-camera #app{text-align:center;color:#2c3e50;margin-top:60px}manage-camera #video{background-color:#fff}manage-camera #canvas{display:none}manage-camera li{display:inline;padding:5px}\n"],encapsulation:2}),c})()},2417:(v,g,i)=>{i.d(g,{T:()=>d});const t=s=>s.charAt(0).toUpperCase()+s.slice(1);class d{constructor(e){this.getFullName=()=>`${t(this.firstName)} ${t(this.paternalSurname)}`,this.id=e.id||"",this.icon=e.icon||"",this.color=e.color||"",this.permission=e.permission||"",this.cpf=e.cpf||"",this.email=e.email||"",this.isLogged=e.isLogged||!1,this.role=e.role||"",this.gender=e.gender||"",this.fullname=e.fullname||"",this.firstName=e.firstName||"",this.secondName=e.secondName||"",this.paternalSurname=e.paternalSurname||"",this.maternalSurname=e.maternalSurname||"",this.birthDate=e.birthDate||"",this.profilePicture=e.profilePicture||"",this.addressPicture=e.addressPicture||"",this.residenceAddress=e.residenceAddress||"",this.billingAddress=e.billingAddress||"",this.phoneNumber=e.phoneNumber||"",this.points=e.points||0}}},4074:(v,g,i)=>{i.d(g,{C:()=>f});var t=i(5861),d=i(7066),s=i(2223),e=i(3144);let f=(()=>{class o extends d.D{constructor(m){var r;super(),r=this,this.http=m,this.createImage=function(){var l=(0,t.Z)(function*(h){return r.http.post(`${r.getApiUrl()}/images`,{...h},{headers:r.getHeaders()}).toPromise()});return function(h){return l.apply(this,arguments)}}()}}return o.\u0275fac=function(m){return new(m||o)(s.Y36(e.eN))},o.\u0275dir=s.lG2({type:o,features:[s.qOj]}),o.\u0275prov=s.Yz7({token:o,factory:o.\u0275fac,providedIn:"root"}),o})()},7228:(v,g,i)=>{i.d(g,{Z:()=>s});const t=void 0,s=["es",[["a.\xa0m.","p.\xa0m."],t,t],t,[["D","L","M","X","J","V","S"],["dom","lun","mar","mi\xe9","jue","vie","s\xe1b"],["domingo","lunes","martes","mi\xe9rcoles","jueves","viernes","s\xe1bado"],["DO","LU","MA","MI","JU","VI","SA"]],t,[["E","F","M","A","M","J","J","A","S","O","N","D"],["ene","feb","mar","abr","may","jun","jul","ago","sept","oct","nov","dic"],["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]],t,[["a. C.","d. C."],t,["antes de Cristo","despu\xe9s de Cristo"]],1,[6,0],["d/M/yy","d MMM y","d 'de' MMMM 'de' y","EEEE, d 'de' MMMM 'de' y"],["H:mm","H:mm:ss","H:mm:ss z","H:mm:ss (zzzz)"],["{1}, {0}",t,t,t],[",",".",";","%","+","-","E","\xd7","\u2030","\u221e","NaN",":"],["#,##0.###","#,##0\xa0%","#,##0.00\xa0\xa4","#E0"],"EUR","\u20ac","euro",{AUD:[t,"$"],BRL:[t,"R$"],BYN:[t,"\u0440."],CAD:[t,"$"],CNY:[t,"\xa5"],EGP:[],ESP:["\u20a7"],GBP:[t,"\xa3"],HKD:[t,"$"],ILS:[t,"\u20aa"],INR:[t,"\u20b9"],JPY:[t,"\xa5"],KRW:[t,"\u20a9"],MXN:[t,"$"],NZD:[t,"$"],PHP:[t,"\u20b1"],RON:[t,"L"],THB:["\u0e3f"],TWD:[t,"NT$"],USD:["US$","$"],XAF:[],XCD:[t,"$"],XOF:[]},"ltr",function d(e){const f=e,o=Math.floor(Math.abs(e)),u=e.toString().replace(/^[^.]*\.?/,"").length,m=parseInt(e.toString().replace(/^[^e]*(e([-+]?\d+))?/,"$2"))||0;return 1===f?1:0===m&&0!==o&&o%1e6==0&&0===u||!(m>=0&&m<=5)?4:5}]}}]);