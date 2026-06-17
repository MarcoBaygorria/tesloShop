import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { find } from 'rxjs';

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

  findAll() {
    return this.productRepository.find({});
  }

  async findOne(id: string) {

    const product = await this.productRepository.findOneBy({id});
      if(!product) 
        throw new NotFoundException(`Producto con el id ${id} no fue encontrado`)
    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
