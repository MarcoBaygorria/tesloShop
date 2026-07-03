<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Teslo API

Esta es una API REST desarrollada con **NestJS** y **TypeScript** enfocada en la gestión de un catálogo de productos (estilo Tesla Shop). El proyecto demuestra el dominio de las bases de un desarrollador Backend Junior

## Características del Proyecto

- **CRUD Completo:** Creación, lectura, actualización y eliminación de productos.
- **Validación de Datos:** Uso de `class-validator` y DTOs para asegurar la integridad de los datos de entrada.
- **Paginación y Filtros:** Endpoints optimizados para soportar paginación (`limit`, `offset`) y búsquedas por término (ID, slug o título).
- **Base de Datos Relacional:** Modelado de datos con **TypeORM** y **PostgreSQL**, incluyendo manejo de imágenes de productos (relación Uno a Muchos).
- **Slug Automático:** Generación automática de slugs amigables para URLs basados en el título del producto.

## 🛠️ Tecnologías Utilizadas.

- NestJS & TypeScript
- TypeORM (Object-Relational Mapping)
- PostgreSQL (Base de datos)
- Docker (Para levantar la base de datos en local)

## 📦 Instalación y Configuración

1. Clonar Proyecto
2. npm install
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```.
4. Cambiar las variables de entorno
5. Levantar la base de datos
```
docker-compose -d
```
6. Levantar: ```npm start:dev```
