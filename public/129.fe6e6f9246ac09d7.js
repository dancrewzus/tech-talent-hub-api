"use strict";(self.webpackChunkimperial=self.webpackChunkimperial||[]).push([[129],{9129:(Q,m,e)=>{e.r(m),e.d(m,{AdminModule:()=>L});var v=e(5030),p=e(6356),c=e(9562),u=e(5861),n=e(2223),g=e(6081),f=e(7760),Z=e(7066),A=e(6550),T=e(4755);function x(t,o){if(1&t&&(n.TgZ(0,"span")(1,"span",19),n._uU(2),n.qZA(),n._uU(3," pendientes"),n.qZA()),2&t){const i=n.oxw(2);n.xp6(2),n.Oqu(i.pendingMovements)}}function U(t,o){1&t&&(n.TgZ(0,"span"),n._uU(1,"Ir"),n.qZA())}function C(t,o){if(1&t&&(n.TgZ(0,"div",4)(1,"div",5)(2,"div",6)(3,"h5",7),n._uU(4,"Pagos por validar"),n.qZA(),n.TgZ(5,"p",8),n._UZ(6,"span",17),n.qZA(),n.TgZ(7,"div",10)(8,"a",11),n.NdJ("click",function(){return!1}),n.YNc(9,x,4,1,"span",18),n.YNc(10,U,2,0,"span",18),n.qZA()()()()()),2&t){const i=n.oxw();n.xp6(8),n.Q6J("routerLink","/admin/movements/validation-payments-pending"),n.xp6(1),n.Q6J("ngIf",i.pendingMovements>0),n.xp6(1),n.Q6J("ngIf",0===i.pendingMovements)}}function D(t,o){1&t&&(n.TgZ(0,"div",4)(1,"div",5)(2,"div",6)(3,"h5",7),n._uU(4,"Anular movimientos"),n.qZA(),n.TgZ(5,"p",8),n._UZ(6,"span",20),n.qZA(),n.TgZ(7,"div",10)(8,"a",11),n.NdJ("click",function(){return!1}),n._uU(9,"Ir"),n.qZA()()()()()),2&t&&(n.xp6(8),n.Q6J("routerLink","/admin/movements/cancel-movement"))}let J=(()=>{class t{constructor(i,r,d,N){var s=this;this.ngxUiLoaderService=i,this.movementsService=r,this.dataService=d,this.titleService=N,this.isAdmin=!1,this.pendingMovements=0,this.loadData=(0,u.Z)(function*(){s.ngxUiLoaderService.startLoader("loader-02");try{const l=yield s.movementsService.movementsPendingCount();if(l){const{data:S}=l;s.pendingMovements=S}}catch(l){s.dataService.errorHandling(l)}finally{s.ngxUiLoaderService.stopLoader("loader-02")}}),this.nothingForNow=()=>{},this.user=this.dataService.getLoggedUser(),this.user&&(this.isAdmin=["Rt","Adm"].includes(this.user.permission))}ngOnInit(){this.titleService.setTitle("IMPERIAL | Inicio"),this.loadData()}}return t.\u0275fac=function(i){return new(i||t)(n.Y36(g.LA),n.Y36(f.M),n.Y36(Z.D),n.Y36(A.Dx))},t.\u0275cmp=n.Xpm({type:t,selectors:[["app-dashboard"]],decls:58,vars:7,consts:[[1,"d-flex","justify-content-between","align-items-center","flex-wrap","grid-margin"],[1,"mb-3","mb-md-0"],[1,"container"],[1,"row","justify-content-md-center"],[1,"col-6","col-md-3","pt-3"],[1,"card"],[1,"card-body"],[1,"card-title"],[1,"card-text","mb-3",2,"font-size","3.5em","text-align","center"],[1,"feather","icon-user"],[1,"d-grid","gap-2"],["href","",1,"btn","btn-primary",3,"routerLink","click"],[1,"feather","icon-edit"],[1,"feather","icon-dollar-sign"],["class","col-6 col-md-3 pt-3",4,"ngIf"],[1,"feather","icon-maximize-2"],[1,"feather","icon-filter"],[1,"feather","icon-check-circle"],[4,"ngIf"],[1,"badge","bg-light","text-dark"],[1,"feather","icon-x-circle"]],template:function(i,r){1&i&&(n.TgZ(0,"div",0)(1,"div")(2,"h4",1),n._uU(3,"\xa1Bienvenido!"),n.qZA()()(),n.TgZ(4,"div",2)(5,"div",3)(6,"div",4)(7,"div",5)(8,"div",6)(9,"h5",7),n._uU(10,"Registro"),n.qZA(),n.TgZ(11,"p",8),n._UZ(12,"span",9),n.qZA(),n.TgZ(13,"div",10)(14,"a",11),n.NdJ("click",function(){return!1}),n._uU(15,"Ir"),n.qZA()()()()(),n.TgZ(16,"div",4)(17,"div",5)(18,"div",6)(19,"h5",7),n._uU(20,"Contratos"),n.qZA(),n.TgZ(21,"p",8),n._UZ(22,"span",12),n.qZA(),n.TgZ(23,"div",10)(24,"a",11),n.NdJ("click",function(){return!1}),n._uU(25,"Ir"),n.qZA()()()()(),n.TgZ(26,"div",4)(27,"div",5)(28,"div",6)(29,"h5",7),n._uU(30,"Pendientes de pago"),n.qZA(),n.TgZ(31,"p",8),n._UZ(32,"span",13),n.qZA(),n.TgZ(33,"div",10)(34,"a",11),n.NdJ("click",function(){return!1}),n._uU(35,"Ir"),n.qZA()()()()(),n.YNc(36,C,11,3,"div",14),n.TgZ(37,"div",4)(38,"div",5)(39,"div",6)(40,"h5",7),n._uU(41,"Ingresos y egresos"),n.qZA(),n.TgZ(42,"p",8),n._UZ(43,"span",15),n.qZA(),n.TgZ(44,"div",10)(45,"a",11),n.NdJ("click",function(){return!1}),n._uU(46,"Ir"),n.qZA()()()()(),n.TgZ(47,"div",4)(48,"div",5)(49,"div",6)(50,"h5",7),n._uU(51,"Resumen del d\xeda"),n.qZA(),n.TgZ(52,"p",8),n._UZ(53,"span",16),n.qZA(),n.TgZ(54,"div",10)(55,"a",11),n.NdJ("click",function(){return!1}),n._uU(56,"Ir"),n.qZA()()()()(),n.YNc(57,D,10,1,"div",14),n.qZA()()),2&i&&(n.xp6(14),n.Q6J("routerLink","/admin/clients/create"),n.xp6(10),n.Q6J("routerLink","/admin/clients/actives"),n.xp6(10),n.Q6J("routerLink","/admin/contracts/pending"),n.xp6(2),n.Q6J("ngIf",r.isAdmin),n.xp6(9),n.Q6J("routerLink","/admin/movements/create"),n.xp6(10),n.Q6J("routerLink","/admin/movements/daily-resume"),n.xp6(2),n.Q6J("ngIf",r.isAdmin))},dependencies:[T.O5,c.rH]}),t})();var M=e(2534),h=e(8247);const a=M.f.routesNames,I=[{path:"",children:[{path:a.dash,component:J,canActivate:[h.a]},{path:a.contracts,loadChildren:()=>Promise.all([e.e(592),e.e(825)]).then(e.bind(e,6825)).then(t=>t.ContractsModule)},{path:a.clients,loadChildren:()=>Promise.all([e.e(577),e.e(592),e.e(534)]).then(e.bind(e,6310)).then(t=>t.ClientsModule)},{path:a.movements,loadChildren:()=>Promise.all([e.e(577),e.e(662)]).then(e.bind(e,5662)).then(t=>t.MovementsModule)},{path:a.config,loadChildren:()=>Promise.all([e.e(592),e.e(538)]).then(e.bind(e,9538)).then(t=>t.ConfigurationModule)},{path:"**",redirectTo:a.dash,pathMatch:"full"}]}];let y=(()=>{class t{}return t.\u0275fac=function(i){return new(i||t)},t.\u0275mod=n.oAB({type:t}),t.\u0275inj=n.cJS({imports:[c.Bz.forChild(I),c.Bz]}),t})(),L=(()=>{class t{}return t.\u0275fac=function(i){return new(i||t)},t.\u0275mod=n.oAB({type:t}),t.\u0275inj=n.cJS({providers:[h.a],imports:[v.u5,p.A,v.UX,y]}),t})()}}]);