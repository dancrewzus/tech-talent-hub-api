"use strict";(self.webpackChunkimperial=self.webpackChunkimperial||[]).push([[335],{8335:(le,w,y)=>{y.r(w),y.d(w,{ContractsModule:()=>K});var T=y(4755),h=y(93),f=y(9585),l=y(5030),b=y(5861),e=y(9523),x=y(3567),A=y(2150);const U=["searchInput"];let S=(()=>{class r{constructor(t,n,a){var i=this;this.clientsService=t,this.dataService=n,this.router=a,this.rows=[],this.temp=[],this.loadingIndicator=!0,this.ColumnMode=f.hq,this.SelectionType=f.RT,this.returnUrl="/contracts/create",this.loadData=(0,b.Z)(function*(){try{const u=yield i.clientsService.findAll();u.length&&(i.rows=u,i.temp=u),i.loadingIndicator=!1}catch(u){i.dataService.errorHandling(u)}}),this.createContractFromClient=u=>{const c=u&&u.selected[0]?u.selected[0].cpf:null,m=this.rows.find(s=>s.cpf===c);void 0!==m&&(this.dataService.setCreatedUser(m),this.router.navigate([this.returnUrl]))},this.searchClient=()=>{try{this.loadingIndicator=!0;const u=this.searchInput.nativeElement.value,c=this.temp.filter(function(m){return-1!==m.fullname.toLowerCase().indexOf(u)||!u});this.rows=c,this.table.offset=0,this.loadingIndicator=!1}catch(u){this.dataService.errorHandling(u)}}}ngOnInit(){this.loadData()}}return r.\u0275fac=function(t){return new(t||r)(e.Y36(x.a),e.Y36(A.D),e.Y36(h.F0))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-contracts-list"]],viewQuery:function(t,n){if(1&t&&(e.Gf(U,5),e.Gf(f.nE,5)),2&t){let a;e.iGM(a=e.CRH())&&(n.searchInput=a.first),e.iGM(a=e.CRH())&&(n.table=a.first)}},decls:25,vars:10,consts:[[1,"page-breadcrumb"],[1,"breadcrumb"],[1,"breadcrumb-item"],["routerLink","/dashboard"],[1,"feather","icon-home"],["aria-current","page",1,"breadcrumb-item","active"],[1,"row"],[1,"d-flex","align-items-center","flex-wrap","text-nowrap"],[1,"input-group","me-2","mb-2"],["name","searchInput","placeholder","Procurar",1,"form-control","border-primary","bg-transparent",2,"border-top-left-radius","1rem !important","border-bottom-left-radius","1rem !important","margin-left","0.5em","margin-right","0.5em"],["searchInput",""],["type","button",1,"btn","btn-primary","btn-icon",3,"click"],[1,"feather","icon-search"],[1,"col-md-12","stretch-card"],[1,"card"],[1,"card-body"],[1,"card-title"],[1,"table-responsive"],[1,"bootstrap",3,"scrollbarH","scrollbarV","rows","loadingIndicator","columnMode","headerHeight","footerHeight","rowHeight","limit","selectionType","select"],["name","Nome completo","prop","fullname"]],template:function(t,n){1&t&&(e.TgZ(0,"nav",0)(1,"ol",1)(2,"li",2)(3,"a",3),e._UZ(4,"span",4),e.qZA()(),e.TgZ(5,"li",2),e._uU(6,"Contratos"),e.qZA(),e.TgZ(7,"li",5),e._uU(8,"Clientes ativos"),e.qZA()()(),e.TgZ(9,"div",6)(10,"div",7)(11,"div",8),e._UZ(12,"input",9,10),e.TgZ(14,"button",11),e.NdJ("click",function(){return n.searchClient()}),e._UZ(15,"span",12),e.qZA()()()(),e.TgZ(16,"div",6)(17,"div",13)(18,"div",14)(19,"div",15)(20,"h6",16),e._uU(21,"Lista de clientes ativos"),e.qZA(),e.TgZ(22,"div",17)(23,"ngx-datatable",18),e.NdJ("select",function(i){return n.createContractFromClient(i)}),e._UZ(24,"ngx-datatable-column",19),e.qZA()()()()()()),2&t&&(e.xp6(23),e.Q6J("scrollbarH",!0)("scrollbarV",!1)("rows",n.rows)("loadingIndicator",n.loadingIndicator)("columnMode",n.ColumnMode.force)("headerHeight",50)("footerHeight",0)("rowHeight",40)("limit",10)("selectionType",n.SelectionType.single))},dependencies:[h.rH,f.nE,f.UC],styles:[".loader[_ngcontent-%COMP%]{width:100%!important;height:100%!important;z-index:5001}"]}),r})(),F=(()=>{class r{constructor(){}ngOnInit(){}}return r.\u0275fac=function(t){return new(t||r)},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-contracts"]],decls:1,vars:0,template:function(t,n){1&t&&e._UZ(0,"router-outlet")},dependencies:[h.lC],encapsulation:2}),r})();var I=y(1764),q=y(7081);let D=(()=>{class r{constructor(t){this.arabicRegex="[\u0600-\u06ff]",this.inputElement=t}onKeyPress(t){"int"===this.appInputRestriction?this.intOnly(t):"float"===this.appInputRestriction?this.floatOnly(t):"noSpecialChars"===this.appInputRestriction?this.noSpecialChars(t):"noSpecialCharsExcept"===this.appInputRestriction?this.noSpecialCharsExcept(t):"noSpecialCharsPassUrl"===this.appInputRestriction?this.noSpecialCharsPassUrl(t):"noInputAndPaste"===this.appInputRestriction&&this.noInputAndPaste(t)}intOnly(t){const n=t,a=n.which?n.which:n.keyCode;-1!==[8,9,13,27].indexOf(a)||65===a&&!0===n.ctrlKey||67===a&&!0===n.ctrlKey||86===a&&!0===n.ctrlKey||88===a&&!0===n.ctrlKey||-1===["1","2","3","4","5","6","7","8","9","0"].indexOf(n.key)&&n.preventDefault()}floatOnly(t){const n=t,a=n.which?n.which:n.keyCode;-1!==[8,9,13,27,46].indexOf(a)||65===a&&!0===n.ctrlKey||67===a&&!0===n.ctrlKey||86===a&&!0===n.ctrlKey||88===a&&!0===n.ctrlKey||-1===["1","2","3","4","5","6","7","8","9","0"].indexOf(n.key)&&n.preventDefault()}noSpecialChars(t){const n=t,a=n.which?n.which:n.keyCode;if(-1!==[8,9,13,27,32].indexOf(a)||a>64&&a<91||a>96&&a<123||a>=48&&a<=57)return;const i=String.fromCharCode(a);new RegExp(this.arabicRegex).test(i)||n.preventDefault()}noSpecialCharsExcept(t){const n=t,a=n.which?n.which:n.keyCode;if(-1!==[8,9,13,27,32,45,46,95].indexOf(a)||a>64&&a<91||a>96&&a<123||a>=48&&a<=57)return;const i=String.fromCharCode(a);new RegExp(this.arabicRegex).test(i)||n.preventDefault()}noSpecialCharsPassUrl(t){const a=t.which?t.which:t.keyCode;if("Tab"!==t.key&&"TAB"!==t.key){if(35!==a&&38!==a)return;t.preventDefault()}}noInputAndPaste(t){t.preventDefault()}onPaste(t){const n=t;let a=/[0-9]/g;"int"===this.appInputRestriction?a=/[0-9]/g:"float"===this.appInputRestriction?a=/[0-9.]/g:"noSpecialChars"===this.appInputRestriction?a=/[a-zA-Z0-9\u0600-\u06FF]/g:"noSpecialCharsExcept"===this.appInputRestriction?a=/[a-zA-Z0-9 (\-)._]/g:"noSpecialCharsPassUrl"===this.appInputRestriction?a=/[a-zA-Z0-9 ~!@$%^*(\\\/\-['`;=+\]),.?":{}|<>_]/g:"noInputAndPaste"===this.appInputRestriction&&n.preventDefault();const i=n.clipboardData?n.clipboardData.getData("text/plain"):"";let u,c=0;for(;null!==(u=a.exec(i));)u.index===a.lastIndex&&a.lastIndex++,u.forEach((m,s)=>{c++});c!==i.length&&n.preventDefault()}}return r.\u0275fac=function(t){return new(t||r)(e.Y36(e.SBq))},r.\u0275dir=e.lG2({type:r,selectors:[["","appInputRestriction",""]],hostBindings:function(t,n){1&t&&e.NdJ("keypress",function(i){return n.onKeyPress(i)})("paste",function(i){return n.onPaste(i)})},inputs:{appInputRestriction:"appInputRestriction"}}),r})();function N(r,d){if(1&r&&(e.TgZ(0,"option",28),e._uU(1),e.qZA()),2&r){const t=d.$implicit;e.s9C("value",t.value),e.xp6(1),e.Oqu(t.title)}}function R(r,d){if(1&r){const t=e.EpF();e.TgZ(0,"div")(1,"div",29)(2,"input",32),e.NdJ("change",function(a){e.CHM(t);const i=e.oxw(3);return e.KtG(i.setNonWorkingDays(a))}),e.qZA(),e.TgZ(3,"label",33),e._uU(4,"Segunda-feira"),e.qZA()(),e.TgZ(5,"div",29)(6,"input",34),e.NdJ("change",function(a){e.CHM(t);const i=e.oxw(3);return e.KtG(i.setNonWorkingDays(a))}),e.qZA(),e.TgZ(7,"label",35),e._uU(8,"Ter\xe7a-feira"),e.qZA()(),e.TgZ(9,"div",29)(10,"input",36),e.NdJ("change",function(a){e.CHM(t);const i=e.oxw(3);return e.KtG(i.setNonWorkingDays(a))}),e.qZA(),e.TgZ(11,"label",37),e._uU(12,"Quarta-feira"),e.qZA()(),e.TgZ(13,"div",29)(14,"input",38),e.NdJ("change",function(a){e.CHM(t);const i=e.oxw(3);return e.KtG(i.setNonWorkingDays(a))}),e.qZA(),e.TgZ(15,"label",39),e._uU(16,"Quinta-feira"),e.qZA()(),e.TgZ(17,"div",29)(18,"input",40),e.NdJ("change",function(a){e.CHM(t);const i=e.oxw(3);return e.KtG(i.setNonWorkingDays(a))}),e.qZA(),e.TgZ(19,"label",41),e._uU(20,"Sexta-feira"),e.qZA()(),e.TgZ(21,"div",29)(22,"input",42),e.NdJ("change",function(a){e.CHM(t);const i=e.oxw(3);return e.KtG(i.setNonWorkingDays(a))}),e.qZA(),e.TgZ(23,"label",43),e._uU(24,"S\xe1bado"),e.qZA()()()}}function M(r,d){if(1&r&&(e.TgZ(0,"div")(1,"div",29),e._UZ(2,"input",30),e.TgZ(3,"label",31),e._uU(4,"Domingo"),e.qZA()(),e.YNc(5,R,25,0,"div",24),e.qZA()),2&r){const t=e.oxw(2);e.xp6(5),e.Q6J("ngIf",t.acceptDaysOff)}}function O(r,d){if(1&r&&(e.TgZ(0,"div")(1,"div",44)(2,"div",45),e._UZ(3,"input",46),e.TgZ(4,"label",47),e._uU(5," Domingo "),e.qZA()(),e.TgZ(6,"div",45),e._UZ(7,"input",48),e.TgZ(8,"label",49),e._uU(9," Segunda-feira "),e.qZA()(),e.TgZ(10,"div",45),e._UZ(11,"input",50),e.TgZ(12,"label",51),e._uU(13," Ter\xe7a-feira "),e.qZA()(),e.TgZ(14,"div",45),e._UZ(15,"input",52),e.TgZ(16,"label",53),e._uU(17," Quarta-feira "),e.qZA()(),e.TgZ(18,"div",45),e._UZ(19,"input",54),e.TgZ(20,"label",55),e._uU(21," Quinta-feira "),e.qZA()(),e.TgZ(22,"div",45),e._UZ(23,"input",56),e.TgZ(24,"label",57),e._uU(25," Sexta-feira "),e.qZA()(),e.TgZ(26,"div",45),e._UZ(27,"input",58),e.TgZ(28,"label",59),e._uU(29," S\xe1bado "),e.qZA()()()()),2&r){const t=e.oxw(2);e.xp6(3),e.s9C("value",t.elementForm.getRawValue().weeklySunday),e.xp6(4),e.s9C("value",t.elementForm.getRawValue().weeklyMonday),e.xp6(4),e.s9C("value",t.elementForm.getRawValue().weeklyTuesday),e.xp6(4),e.s9C("value",t.elementForm.getRawValue().weeklyWednesday),e.xp6(4),e.s9C("value",t.elementForm.getRawValue().weeklyThursday),e.xp6(4),e.s9C("value",t.elementForm.getRawValue().weeklyFriday),e.xp6(4),e.s9C("value",t.elementForm.getRawValue().weeklySaturday)}}function H(r,d){if(1&r){const t=e.EpF();e.TgZ(0,"div",8)(1,"div",9)(2,"div",10)(3,"div",11)(4,"h6",12),e._uU(5,"Contrato"),e.qZA(),e.TgZ(6,"form",13)(7,"div",14)(8,"span")(9,"b"),e._uU(10,"CPF:"),e.qZA(),e._uU(11),e.qZA(),e._UZ(12,"br"),e.TgZ(13,"span")(14,"b"),e._uU(15,"Nome:"),e.qZA(),e._uU(16),e.qZA(),e._UZ(17,"br"),e.TgZ(18,"span")(19,"b"),e._uU(20,"Sobrenome:"),e.qZA(),e._uU(21),e.qZA(),e._UZ(22,"br"),e.TgZ(23,"span")(24,"b"),e._uU(25,"N\xfamero de telefone:"),e.qZA(),e._uU(26),e.qZA(),e._UZ(27,"br"),e.TgZ(28,"span")(29,"b"),e._uU(30,"Data do \xfaltimo contrato:"),e.qZA(),e._uU(31),e.qZA(),e._UZ(32,"br"),e.qZA(),e._UZ(33,"hr"),e.TgZ(34,"div",14)(35,"label",15),e._uU(36,"Forma de pagamento"),e.qZA(),e.TgZ(37,"select",16),e.NdJ("change",function(){e.CHM(t);const a=e.oxw();return e.KtG(a.setModality())}),e.TgZ(38,"option",17),e._uU(39,"Di\xe1rio"),e.qZA(),e.TgZ(40,"option",18),e._uU(41,"Semanalmente"),e.qZA()()(),e.TgZ(42,"div",14)(43,"label",19),e._uU(44,"Modalidade"),e.qZA(),e.TgZ(45,"select",20),e.NdJ("change",function(){e.CHM(t);const a=e.oxw();return e.KtG(a.calculateTotal())}),e.YNc(46,N,2,2,"option",21),e.qZA()(),e.TgZ(47,"div",14)(48,"label",22),e._uU(49,"Quantia"),e.qZA(),e.TgZ(50,"input",23),e.NdJ("change",function(){e.CHM(t);const a=e.oxw();return e.KtG(a.calculateTotal())}),e.qZA()(),e.TgZ(51,"div",14)(52,"span")(53,"b"),e._uU(54,"PAGAMENTO POR DIA:"),e.qZA(),e._uU(55),e.qZA(),e._UZ(56,"br"),e.TgZ(57,"span")(58,"b"),e._uU(59,"TOTAL:"),e.qZA(),e._uU(60),e.qZA(),e._UZ(61,"br"),e.qZA(),e.TgZ(62,"h4"),e._uU(63),e.qZA(),e._UZ(64,"br"),e.YNc(65,M,6,1,"div",24),e.YNc(66,O,30,7,"div",24),e._UZ(67,"hr"),e.TgZ(68,"div",25)(69,"button",26),e.NdJ("click",function(a){e.CHM(t);const i=e.oxw();return e.KtG(i.createContract(a))}),e._uU(70,"Aceitar"),e.qZA(),e.TgZ(71,"button",27),e.NdJ("click",function(){return!1}),e._uU(72,"Cancelar"),e.qZA()()()()()()()}if(2&r){const t=e.oxw();e.xp6(6),e.Q6J("formGroup",t.elementForm),e.xp6(5),e.hij(" ",t.elementForm.getRawValue().cpf,""),e.xp6(5),e.hij(" ",t.elementForm.getRawValue().name,""),e.xp6(5),e.hij(" ",t.elementForm.getRawValue().lastname,""),e.xp6(5),e.hij(" ",t.elementForm.getRawValue().phone,""),e.xp6(5),e.hij(" ",t.elementForm.getRawValue().lastContract,""),e.xp6(15),e.Q6J("ngForOf",t.modalityOptions),e.xp6(9),e.hij(" ",t.elementForm.getRawValue().paymentAmount," Reais"),e.xp6(5),e.hij(" ",t.elementForm.getRawValue().totalAmount," Reais"),e.xp6(3),e.Oqu(t.dayMessage),e.xp6(2),e.Q6J("ngIf","daily"===t.modalityType),e.xp6(1),e.Q6J("ngIf","weekly"===t.modalityType),e.xp6(3),e.Q6J("disabled",t.elementForm.invalid),e.xp6(2),e.Q6J("routerLink","/dashboard")}}let J=(()=>{class r{constructor(t,n,a,i,u){var c=this;this.changeDetectorRefs=t,this.contractsService=n,this.dataService=a,this.formBuilder=i,this.router=u,this.returnUrl="/dashboard",this.rows=[],this.modalityOptions=[],this.loadingIndicator=!0,this.ColumnMode=f.hq,this.createdUser=null,this.dayMessage="Dias n\xe3o \xfateis",this.modalityType="daily",this.acceptDaysOff=!1,this.focusedInputs={loanAmount:!1},this.createForm=()=>this.formBuilder.group({cpf:["",l.kI.required],name:["",l.kI.required],lastname:["",l.kI.required],phone:["",l.kI.required],lastContract:["",l.kI.required],modality:["",l.kI.required],modalityOptions:["",l.kI.required],loanAmount:["",l.kI.required],percent:["",l.kI.required],payments:["",l.kI.required],totalAmount:["",l.kI.required],paymentAmount:["",l.kI.required],dailySunday:[!0],dailyMonday:[!1],dailyTuesday:[!1],dailyWednesday:[!1],dailyThursday:[!1],dailyFriday:[!1],dailySaturday:[!1],weeklySunday:[!1],weeklyMonday:[!1],weeklyTuesday:[!1],weeklyWednesday:[!1],weeklyThursday:[!1],weeklyFriday:[!1],weeklySaturday:[!1]}),this.patchForm=m=>{const s=this.modalityOptions[0];this.elementForm.patchValue({cpf:this.createdUser?this.createdUser.cpf:"",name:this.createdUser?this.createdUser.firstName:"",lastname:this.createdUser?this.createdUser.paternalSurname:"",phone:this.createdUser?this.createdUser.phoneNumber:"",lastContract:m,modality:"daily",modalityOptions:s.value,loanAmount:null,percent:null,payments:null,totalAmount:"0",paymentAmount:"0"}),this.elementForm.controls.dailySunday.disable(),this.acceptDaysOff=s.offDays||!1,this.createdUser&&(this.elementForm.controls.cpf.disable(),this.elementForm.controls.name.disable(),this.elementForm.controls.lastname.disable(),this.elementForm.controls.phone.disable()),this.elementForm.controls.totalAmount.disable(),this.elementForm.controls.paymentAmount.disable()},this.return=()=>this.router.navigate(["/contracts/list"]),this.loadData=(0,b.Z)(function*(){c.modalityOptions=[{title:"10% 11d",value:"10-11",percent:10,days:11,offDays:!0},{title:"20% 18d",value:"20-18",percent:20,days:18,offDays:!0},{title:"20% 20d",value:"20-20",percent:20,days:20,offDays:!0},{title:"20% 24d",value:"20-24",percent:20,days:24,offDays:!1},{title:"26% 30d",value:"26-30",percent:26,days:30,offDays:!1}];try{let m=null,s="Sem informa\xe7\xe3o";if(c.createdUser){const p=yield c.contractsService.loadContractData(c.createdUser.id);p?.length>0&&(m=p[0],m.status&&(c.dataService.errorHandling({front:!0,message:"O cliente tem um contrato ativo"}),c.return()),s=m.lastContractDate)}c.loadingIndicator=!1,c.patchForm(s)}catch(m){c.dataService.errorHandling(m)}}),this.createContract=function(){var m=(0,b.Z)(function*(s){try{s.preventDefault();const p=c.elementForm.getRawValue();let o="";const{lastContract:g,modality:v,modalityOptions:_,loanAmount:C,percent:Z,payments:k,totalAmount:Y,paymentAmount:G,dailySunday:P,dailyMonday:$,dailyTuesday:L,dailyWednesday:Q,dailyThursday:j,dailyFriday:B,dailySaturday:z,weeklySunday:X,weeklyMonday:ee,weeklyTuesday:te,weeklyWednesday:ae,weeklyThursday:ne,weeklyFriday:re,weeklySaturday:ie}=p;"daily"===v?(P&&(o=`${o}Sun`),$&&(o=`${o}Mon`),L&&(o=`${o}Tue`),Q&&(o=`${o}Wed`),j&&(o=`${o}Thu`),B&&(o=`${o}Fri`),z&&(o=`${o}Sat`)):(X&&(o=`${o}Sun`),ee&&(o=`${o}Mon`),te&&(o=`${o}Tue`),ae&&(o=`${o}Wed`),ne&&(o=`${o}Thu`),re&&(o=`${o}Fri`),ie&&(o=`${o}Sat`));const oe={id:"",lastContractDate:"Sem informa\xe7\xe3o"===g?null:g,client:c.createdUser?c.createdUser?.id:"",modality:p.modality,modalityOptions:_,loanAmount:C,percent:Z,payments:k,totalAmount:Y,paymentAmount:G,nonWorkingDays:o,createdAt:I().format("DD/MM/YYYY HH:mm:ss"),paymentList:[]};yield c.contractsService.createContract(oe),c.router.navigate([c.returnUrl])}catch(p){c.dataService.errorHandling(p)}});return function(s){return m.apply(this,arguments)}}(),this.calculateTotal=()=>{this.elementForm.patchValue({totalAmount:"0",paymentAmount:"0"});const m=this.elementForm.getRawValue(),s=this.modalityOptions.find(k=>k.value===m.modalityOptions),p=s?.percent||"0",o=s?.days||"0",g=Number.parseInt(m.loanAmount),v=Number.parseInt(p),_=Number.parseInt(o),C=g*(v/100)+g,Z=_>0?C/_:0;this.acceptDaysOff=s?.offDays||!1,this.elementForm.patchValue({totalAmount:isNaN(C)?0:Number.parseInt(`${C}`),paymentAmount:isNaN(Z)?0:Number.parseInt(`${Z}`),payments:_,percent:v})},this.setModality=()=>{const s=this.elementForm.getRawValue().modality;"daily"===s?(this.dayMessage="Dias n\xe3o \xfateis",this.elementForm.patchValue({dailySunday:!0,dailyMonday:!1,dailyTuesday:!1,dailyWednesday:!1,dailyThursday:!1,dailyFriday:!1,dailySaturday:!1})):(this.dayMessage="Dia de pagamento",this.elementForm.patchValue({weeklySunday:!0,weeklyMonday:!1,weeklyTuesday:!1,weeklyWednesday:!1,weeklyThursday:!1,weeklyFriday:!1,weeklySaturday:!1})),this.modalityType=s,this.changeDetectorRefs.detectChanges()},this.setNonWorkingDays=m=>{if(m.currentTarget.checked){const s=this.elementForm.getRawValue();if("daily"===s.modality)for(const p in s)Object.prototype.hasOwnProperty.call(s,p)&&p.includes("daily")&&p!==m.currentTarget.name&&"dailySunday"!==p&&(s[p]=!1);this.elementForm.patchValue({...s}),this.changeDetectorRefs.detectChanges()}}}ngOnInit(){this.createdUser=this.dataService.getCreatedUser()??null,this.createdUser||(this.dataService.errorHandling({front:!0,message:"voc\xea deve selecionar um cliente"}),this.return()),this.elementForm=this.createForm(),this.loadData()}ngOnDestroy(){this.dataService.clearCreatedUser()}}return r.\u0275fac=function(t){return new(t||r)(e.Y36(e.sBO),e.Y36(q.W),e.Y36(A.D),e.Y36(l.qu),e.Y36(h.F0))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-contracts-create"]],decls:11,vars:1,consts:[[1,"page-breadcrumb"],[1,"breadcrumb"],[1,"breadcrumb-item"],["routerLink","/dashboard"],[1,"feather","icon-home"],["routerLink","/contracts/list"],["aria-current","page",1,"breadcrumb-item","active"],["class","row",4,"ngIf"],[1,"row"],[1,"col-md-12","stretch-card"],[1,"card"],[1,"card-body"],[1,"card-title"],["name","elementForm","novalidate","",3,"formGroup"],[1,"mb-3"],["for","modality",1,"form-label"],["id","modality","formControlName","modality","required","",1,"form-select",3,"change"],["value","daily","selected",""],["value","weekly"],["for","modalityOptions",1,"form-label"],["id","modalityOptions","formControlName","modalityOptions","required","",1,"form-select",3,"change"],["selected","",3,"value",4,"ngFor","ngForOf"],["for","loanAmount",1,"form-label"],["type","text","id","loanAmount","name","loanAmount","appInputRestriction","float","formControlName","loanAmount","oninput","this.value=this.value.replace(/[^0-9]/g,'')","required","",1,"form-control",2,"text-align","right","padding-right","1em",3,"change"],[4,"ngIf"],[2,"text-align","center"],["type","submit",1,"btn","btn-primary","me-2",3,"disabled","click"],[1,"btn","btn-secondary",3,"routerLink","click"],["selected","",3,"value"],[1,"form-check","mb-1"],["type","checkbox","formControlName","dailySunday","name","dailySunday","id","dailySunday",1,"form-check-input","pr-2"],["for","dailySunday",1,"form-label","pl-2"],["type","checkbox","formControlName","dailyMonday","name","dailyMonday","id","dailyMonday",1,"form-check-input","pr-2",3,"change"],["for","dailyMonday",1,"form-label","pl-2"],["type","checkbox","formControlName","dailyTuesday","name","dailyTuesday","id","dailyTuesday",1,"form-check-input","pr-2",3,"change"],["for","dailyTuesday",1,"form-label","pl-2"],["type","checkbox","formControlName","dailyWednesday","name","dailyWednesday","id","dailyWednesday",1,"form-check-input","pr-2",3,"change"],["for","dailyWednesday",1,"form-label","pl-2"],["type","checkbox","formControlName","dailyThursday","name","dailyThursday","id","dailyThursday",1,"form-check-input","pr-2",3,"change"],["for","dailyThursday",1,"form-label","pl-2"],["type","checkbox","formControlName","dailyFriday","name","dailyFriday","id","dailyFriday",1,"form-check-input","pr-2",3,"change"],["for","dailyFriday",1,"form-label","pl-2"],["type","checkbox","formControlName","dailySaturday","name","dailySaturday","id","dailySaturday",1,"form-check-input","pr-2",3,"change"],["for","dailySaturday",1,"form-label","pl-2"],[1,"mb-4"],[1,"form-check","mb-2"],["type","radio","formControlName","weeklySunday","name","weeklySelection","id","weeklySunday",1,"form-check-input",3,"value"],["for","weeklySunday",1,"form-check-label"],["type","radio","formControlName","weeklyMonday","name","weeklySelection","id","weeklyMonday","selected","",1,"form-check-input",3,"value"],["for","weeklyMonday",1,"form-check-label"],["type","radio","formControlName","weeklyTuesday","name","weeklySelection","id","weeklyTuesday",1,"form-check-input",3,"value"],["for","weeklyTuesday",1,"form-check-label"],["type","radio","formControlName","weeklyWednesday","name","weeklySelection","id","weeklyWednesday",1,"form-check-input",3,"value"],["for","weeklyWednesday",1,"form-check-label"],["type","radio","formControlName","weeklyThursday","name","weeklySelection","id","weeklyThursday",1,"form-check-input",3,"value"],["for","weeklyThursday",1,"form-check-label"],["type","radio","formControlName","weeklyFriday","name","weeklySelection","id","weeklyFriday",1,"form-check-input",3,"value"],["for","weeklyFriday",1,"form-check-label"],["type","radio","formControlName","weeklySaturday","name","weeklySelection","id","weeklySaturday",1,"form-check-input",3,"value"],["for","weeklySaturday",1,"form-check-label"]],template:function(t,n){1&t&&(e.TgZ(0,"nav",0)(1,"ol",1)(2,"li",2)(3,"a",3),e._UZ(4,"span",4),e.qZA()(),e.TgZ(5,"li",2)(6,"a",5),e._uU(7,"Contratos"),e.qZA()(),e.TgZ(8,"li",6),e._uU(9,"Registrar contrato"),e.qZA()()(),e.YNc(10,H,73,14,"div",7)),2&t&&(e.xp6(10),e.Q6J("ngIf",!n.loadingIndicator))},dependencies:[D,l._Y,l.YN,l.Kr,l.Fj,l.Wl,l.EJ,l._,l.JJ,l.JL,l.Q7,l.sg,l.u,T.sg,T.O5,h.rH]}),r})();var V=y(9444);let W=(()=>{class r{}return r.\u0275fac=function(t){return new(t||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({}),r})();const E=[{path:"",component:F,children:[{path:"",redirectTo:"list",pathMatch:"full"},{path:"list",component:S},{path:"create",component:J}]}];let K=(()=>{class r{}return r.\u0275fac=function(t){return new(t||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({imports:[V.v,W,l.u5,l.UX,T.ez,h.Bz.forChild(E),f.xD]}),r})()}}]);