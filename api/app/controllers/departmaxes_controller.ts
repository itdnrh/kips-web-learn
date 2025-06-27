import Departmax from '#models/departmax'
import { DynamicModelService } from '#services/dynamic_service'
import JsonService from '#services/json_service'
import SerialService from '#services/serial_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class DepartmaxexController {
  /**
   * Display a list of resource
   */
  async index({request,response}: HttpContext) {
    // Create service instance directly
    const departmaxService = new DynamicModelService<Departmax>(Departmax, 'position_id')
    const departmaxs = await departmaxService.findAll()
        
    const jsonService = new JsonService()
        
    const data: any = await jsonService.jsonData({
      data: departmaxs,
      sort: request.input('sort'),
      order: request.input('order'),
      page: request.input('page'),
      size: request.input('size'),
      search: request.input('search'),
    })
                
    return response.ok(data)
  }

  /**
   * Display form to create a new record
   */
  async create({request, response}: HttpContext) {
    try {
        let departmaxId;
        if(request.input('departmax_id') !== null && request.input('departmax_id') !== undefined){
          departmaxId = request.input('departmax_id');
        } else {
          departmaxId = await SerialService.getSerial('departmax_id');
        }
          const data: any = {
            departmax_id: departmaxId, 
            name: request.input('name'),
            detail: request.input('detail'),
            status: request.input('status'),
          }
          // Use dynamic service to create user
          const departmaxService = new DynamicModelService<Departmax>(Departmax, 'departmax_id')
          const departmax: any = await departmaxService.insert(data)
      return response.ok({ ok: true, data: departmax })
    } catch (error) {
      return response.badRequest({ ok: false, message: 'Failed to create user', error: error.message })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    console.log(request);
    
  }

  /**
   * Show individual record
   */
  async show({ params,response }: HttpContext) {
     try {
          // Use dynamic service to find user by primary key
          const departmaxService = new DynamicModelService<Departmax>(Departmax, 'departmax_id')
          const departmax: any = await departmaxService.findByPrimaryKey(params.id)
    
          if (!departmax) {
            return response.notFound({ ok: false, message: 'User not found' })
          }    
      return response.ok({ ok: true, data: departmax })
    } catch (error) {
      return response.badRequest({ ok: false, message: 'Failed to fetch user', error: error.message })
    }
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {console.log(params);}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request ,response}: HttpContext) {
    try {
          const updateData = request.only([
            'name',
            'detail',
            'status',
          ])
    
          // Use dynamic service to update user by primary key
          const departmaxService = new DynamicModelService<Departmax>(Departmax, 'departmax_id')
          const departmax: any = await departmaxService.update(params.id, updateData)
    
          if (!departmax) {
            return response.notFound({ ok: false, message: 'User not found' })
          }
  
          return response.ok({ ok: true, data: departmax })
        } catch (error) {
          return response.badRequest({ ok: false, message: 'Failed to update user', error: error.message })
        }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
          // Use dynamic service to delete user by primary key
      const departmaxService = new DynamicModelService<Departmax>(Departmax, 'departmax_id')
      const deletedDepeat = await departmaxService.delete(params.id)
    
      if (!deletedDepeat) {
        return response.notFound({ ok: false, message: 'User not found' })
      }
    
      return response.ok({ ok: true, message: 'User deleted successfully' })
    } catch (error) {
      return response.badRequest({ ok: false, message: 'Failed to delete user', error: error.message })
    }
  }
}