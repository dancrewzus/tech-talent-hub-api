"use strict";(self.webpackChunkimperial=self.webpackChunkimperial||[]).push([[129],{9129:(Q,m,e)=>{e.r(m),e.d(m,{AdminModule:()=>L});var v=e(5030),u=e(6356),c=e(9562),f=e(5861),n=e(2223),p=e(6081),g=e(7760),Z=e(7066),A=e(6550),T=e(4755);function x(t,o){if(1&t&&(n.TgZ(0,"span")(1,"span",18),n._uU(2),n.qZA(),n._uU(3," pendientes"),n.qZA()),2&t){const i=n.oxw(2);n.xp6(2),n.Oqu(i.pendingMovements)}}function U(t,o){1&t&&(n.TgZ(0,"span"),n._uU(1,"Ir"),n.qZA())}function C(t,o){if(1&t&&(n.TgZ(0,"div",4)(1,"div",5)(2,"div",6)(3,"h5",7),n._UZ(4,"span",16),n._uU(5," Validaciones"),n.qZA(),n.TgZ(6,"div",9)(7,"a",10),n.NdJ("click",function(){return!1}),n.YNc(8,x,4,1,"span",17),n.YNc(9,U,2,0,"span",17),n.qZA()()()()()),2&t){const i=n.oxw();n.xp6(7),n.Q6J("routerLink","/admin/movements/validation-payments-pending"),n.xp6(1),n.Q6J("ngIf",i.pendingMovements>0),n.xp6(1),n.Q6J("ngIf",0===i.pendingMovements)}}function M(t,o){1&t&&(n.TgZ(0,"div",4)(1,"div",5)(2,"div",6)(3,"h5",7),n._UZ(4,"span",19),n._uU(5," Anular movimientos"),n.qZA(),n.TgZ(6,"div",9)(7,"a",10),n.NdJ("click",function(){return!1}),n._uU(8,"Ir"),n.qZA()()()()()),2&t&&(n.xp6(7),n.Q6J("routerLink","/admin/movements/cancel-movement"))}let J=(()=>{class t{constructor(i,r,d,N){var s=this;this.ngxUiLoaderService=i,this.movementsService=r,this.dataService=d,this.titleService=N,this.isAdmin=!1,this.pendingMovements=0,this.loadData=(0,f.Z)(function*(){s.ngxUiLoaderService.startLoader("loader-02");try{const l=yield s.movementsService.movementsPendingCount();if(l){const{data:S}=l;s.pendingMovements=S}}catch(l){s.dataService.errorHandling(l)}finally{s.ngxUiLoaderService.stopLoader("loader-02")}}),this.nothingForNow=()=>{},this.user=this.dataService.getLoggedUser(),this.user&&(this.isAdmin=["Rt","Adm"].includes(this.user.permission))}ngOnInit(){this.titleService.setTitle("SISTEMA IMPERIAL | Inicio"),this.loadData()}}return t.\u0275fac=function(i){return new(i||t)(n.Y36(p.LA),n.Y36(g.M),n.Y36(Z.D),n.Y36(A.Dx))},t.\u0275cmp=n.Xpm({type:t,selectors:[["app-dashboard"]],decls:53,vars:7,consts:[[1,"d-flex","justify-content-between","align-items-center","flex-wrap","grid-margin"],[1,"mb-3","mb-md-0"],[1,"container"],[1,"row","justify-content-md-center"],[1,"col-6","col-md-3","pt-3"],[1,"card"],[1,"card-body"],[1,"card-title"],[1,"feather","icon-user"],[1,"d-grid","gap-2"],["href","",1,"btn","btn-primary",3,"routerLink","click"],[1,"feather","icon-edit"],[1,"feather","icon-dollar-sign"],["class","col-6 col-md-3 pt-3",4,"ngIf"],[1,"feather","icon-maximize-2"],[1,"feather","icon-filter"],[1,"feather","icon-check-circle"],[4,"ngIf"],[1,"badge","bg-light","text-dark"],[1,"feather","icon-x-circle"]],template:function(i,r){1&i&&(n.TgZ(0,"div",0)(1,"div")(2,"h4",1),n._uU(3,"\xa1Bienvenido!"),n.qZA()()(),n.TgZ(4,"div",2)(5,"div",3)(6,"div",4)(7,"div",5)(8,"div",6)(9,"h5",7),n._UZ(10,"span",8),n._uU(11," Registro"),n.qZA(),n.TgZ(12,"div",9)(13,"a",10),n.NdJ("click",function(){return!1}),n._uU(14,"Ir"),n.qZA()()()()(),n.TgZ(15,"div",4)(16,"div",5)(17,"div",6)(18,"h5",7),n._UZ(19,"span",11),n._uU(20," Clientes"),n.qZA(),n.TgZ(21,"div",9)(22,"a",10),n.NdJ("click",function(){return!1}),n._uU(23,"Ir"),n.qZA()()()()(),n.TgZ(24,"div",4)(25,"div",5)(26,"div",6)(27,"h5",7),n._UZ(28,"span",12),n._uU(29," Contratos"),n.qZA(),n.TgZ(30,"div",9)(31,"a",10),n.NdJ("click",function(){return!1}),n._uU(32,"Ir"),n.qZA()()()()(),n.YNc(33,C,10,3,"div",13),n.TgZ(34,"div",4)(35,"div",5)(36,"div",6)(37,"h5",7),n._UZ(38,"span",14),n._uU(39," Ingresos y egresos"),n.qZA(),n.TgZ(40,"div",9)(41,"a",10),n.NdJ("click",function(){return!1}),n._uU(42,"Ir"),n.qZA()()()()(),n.TgZ(43,"div",4)(44,"div",5)(45,"div",6)(46,"h5",7),n._UZ(47,"span",15),n._uU(48," Arqueo"),n.qZA(),n.TgZ(49,"div",9)(50,"a",10),n.NdJ("click",function(){return!1}),n._uU(51,"Ir"),n.qZA()()()()(),n.YNc(52,M,9,1,"div",13),n.qZA()()),2&i&&(n.xp6(13),n.Q6J("routerLink","/admin/clients/create"),n.xp6(9),n.Q6J("routerLink","/admin/clients/actives"),n.xp6(9),n.Q6J("routerLink","/admin/contracts/pending"),n.xp6(2),n.Q6J("ngIf",r.isAdmin),n.xp6(8),n.Q6J("routerLink","/admin/movements/create"),n.xp6(9),n.Q6J("routerLink","/admin/movements/daily-resume"),n.xp6(2),n.Q6J("ngIf",r.isAdmin))},dependencies:[T.O5,c.rH]}),t})();var D=e(2534),h=e(8247);const a=D.f.routesNames,I=[{path:"",children:[{path:a.dash,component:J,canActivate:[h.a]},{path:a.contracts,loadChildren:()=>Promise.all([e.e(592),e.e(825)]).then(e.bind(e,6825)).then(t=>t.ContractsModule)},{path:a.clients,loadChildren:()=>Promise.all([e.e(181),e.e(369),e.e(708),e.e(592),e.e(853)]).then(e.bind(e,2853)).then(t=>t.ClientsModule)},{path:a.movements,loadChildren:()=>Promise.all([e.e(181),e.e(708),e.e(662)]).then(e.bind(e,5662)).then(t=>t.MovementsModule)},{path:a.config,loadChildren:()=>Promise.all([e.e(181),e.e(369),e.e(655)]).then(e.bind(e,6655)).then(t=>t.ConfigurationModule)},{path:"**",redirectTo:a.dash,pathMatch:"full"}]}];let y=(()=>{class t{}return t.\u0275fac=function(i){return new(i||t)},t.\u0275mod=n.oAB({type:t}),t.\u0275inj=n.cJS({imports:[c.Bz.forChild(I),c.Bz]}),t})(),L=(()=>{class t{}return t.\u0275fac=function(i){return new(i||t)},t.\u0275mod=n.oAB({type:t}),t.\u0275inj=n.cJS({providers:[h.a],imports:[v.u5,u.A,v.UX,y]}),t})()}}]);