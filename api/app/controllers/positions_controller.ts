import Position from '#models/position'
import { DynamicModelService } from '#services/dynamic_service'
import JsonService from '#services/json_service'
import SerialService from '#services/serial_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class PositionsController {
  /**
   * Display a list of resource
   */
  async index({request,response}: HttpContext) {
    // Create service instance directly
    const postionService = new DynamicModelService<Position>(Position, 'position_id')
    const positions = await postionService.findAll()
        
    const jsonService = new JsonService()
        
    const data: any = await jsonService.jsonData({
      data: positions,
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
        let positionId;
        if(request.input('position_id') !== null && request.input('position_id') !== undefined){
          positionId = request.input('position_id');
        } else {
          positionId = await SerialService.getSerial('position_id');
        }
          const data: any = {
            position_id: positionId, 
            name: request.input('name'),
            detail: request.input('detail'),
            status: request.input('status'),
          }
          // Use dynamic service to create user
          const positionService = new DynamicModelService<Position>(Position, 'position_id')
          const position: any = await positionService.insert(data)
      return response.ok({ ok: true, data: position })
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
          const positionService = new DynamicModelService<Position>(Position, 'position_id')
          const position: any = await positionService.findByPrimaryKey(params.id)
    
          if (!position) {
            return response.notFound({ ok: false, message: 'User not found' })
          }    
      return response.ok({ ok: true, data: position })
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
          const positionService = new DynamicModelService<Position>(Position, 'position_id')
          const position: any = await positionService.update(params.id, updateData)
    
          if (!position) {
            return response.notFound({ ok: false, message: 'User not found' })
          }
  
          return response.ok({ ok: true, data: position })
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
      const userService = new DynamicModelService<Position>(Position, 'position_id')
      const deletedUser = await userService.delete(params.id)
    
      if (!deletedUser) {
        return response.notFound({ ok: false, message: 'User not found' })
      }
    
      return response.ok({ ok: true, message: 'User deleted successfully' })
    } catch (error) {
      return response.badRequest({ ok: false, message: 'Failed to delete user', error: error.message })
    }
  }
}