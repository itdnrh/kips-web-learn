import router from "@adonisjs/core/services/router";
import DepartmaxexController from '#controllers/departmaxes_controller';
export function departmaxRoute(){
  const departmaxexCtrl= new DepartmaxexController();
  router.group(()=>{
    router.get('/list',departmaxexCtrl.index)
    router.post('/create',departmaxexCtrl.create)
    router.get('/details/:id', departmaxexCtrl.show)     // GET /users/details/:id
    router.put('/update/:id', departmaxexCtrl.update)    // PUT /users/update/:id  
    router.delete('/delete/:id', departmaxexCtrl.destroy) // DELETE /users/delete/:id
  }) .prefix('/departmax')
}