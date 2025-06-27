import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Departmax extends BaseModel {
  public static table = 'departmax';

  @column({ isPrimary: true })
  declare departmaxId: number

  @column()
  declare name: string | null

  @column()
  declare detail: string | null

  @column()
  declare status: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}