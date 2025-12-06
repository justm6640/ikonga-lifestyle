
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, PhaseType } from '@prisma/client';

@Controller()
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) { }

    // --- ADMIN ROUTES ---
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('admin/recipes')
    create(@Body() createRecipeDto: CreateRecipeDto) {
        return this.recipesService.create(createRecipeDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('admin/recipes')
    findAllAdmin() {
        return this.recipesService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put('admin/recipes/:id')
    update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
        return this.recipesService.update(id, updateRecipeDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('admin/recipes/:id')
    remove(@Param('id') id: string) {
        return this.recipesService.remove(id);
    }

    // --- PUBLIC/SUBSCRIBER ROUTES ---
    @UseGuards(JwtAuthGuard)
    @Get('recipes/phase/:phaseTag')
    findByPhase(@Param('phaseTag') phaseTag: PhaseType) {
        return this.recipesService.findByPhase(phaseTag);
    }

    @UseGuards(JwtAuthGuard)
    @Get('recipes/:id')
    findOne(@Param('id') id: string) {
        return this.recipesService.findOne(id);
    }
}
