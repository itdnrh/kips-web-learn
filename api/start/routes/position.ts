import PositionsController from '#controllers//positions_controller';
import router from "@adonisjs/core/services/router";
export function positionRoute(){
  const positionCtrl = new PositionsController();
  router.group(()=>{
    router.get('/list',positionCtrl.index)
    router.post('/create',positionCtrl.create)
    router.get('/details/:id', positionCtrl.show)     // GET /users/details/:id
    router.put('/update/:id', positionCtrl.update)    // PUT /users/update/:id  
    router.delete('/delete/:id', positionCtrl.destroy) // DELETE /users/delete/:id
  }) .prefix('/positions')
}