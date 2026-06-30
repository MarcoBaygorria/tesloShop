import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import {validate as isUUID} from 'uuid'
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      //Insertar
      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product) //guardar en la bb.dd

      return product
      
    } catch (error: any) {
      this.handleDBduplicateError(error)
    }    
  }

  findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto

    return this.productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {

    //Definiendo el producto
    let product: Product | null = null

    if(isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term})
    }else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        }).getOne() //solo 1 de los dos.
    }

    if(!product) 
        throw new NotFoundException(`Producto con el ${term} no fue encontrado`)

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //Buscar producto por el id
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });
    //Si no encuentra nada
    if (!product) throw new BadRequestException(`Producto con el id: ${id} no encontrado`)

    //Guardando el producto
  try {
    await this.productRepository.save(product);
      return product;
    } catch (error: any) {
      this.handleDBduplicateError(error)
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product);
  }

  //Error de llave duplicada
  private handleDBduplicateError(error: any) {
    if(error.code === '23505')
      throw new BadRequestException(error.detail)
      
    this.logger.error(error)
      throw new InternalServerErrorException('Check server logs')
    }
}
