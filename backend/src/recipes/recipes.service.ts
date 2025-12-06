
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PhaseType } from '@prisma/client';

@Injectable()
export class RecipesService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateRecipeDto) {
        return this.prisma.recipe.create({
            data: {
                title: data.title,
                description: data.description,
                ingredients: data.ingredients as any, // JSON
                steps: data.steps as any,             // JSON
                calories: data.calories,
                phaseTag: data.phaseTag,
            },
        });
    }

    async findAll() {
        return this.prisma.recipe.findMany({
            orderBy: { title: 'asc' },
        });
    }

    async findOne(id: string) {
        const recipe = await this.prisma.recipe.findUnique({
            where: { id },
        });
        if (!recipe) {
            throw new NotFoundException(`Recipe with ID ${id} not found`);
        }
        return recipe;
    }

    async findByPhase(phase: PhaseType) {
        return this.prisma.recipe.findMany({
            where: { phaseTag: phase },
            orderBy: { title: 'asc' },
        });
    }

    async update(id: string, data: UpdateRecipeDto) {
        // Verify existence
        await this.findOne(id);

        return this.prisma.recipe.update({
            where: { id },
            data: {
                ...data,
                ingredients: data.ingredients as any,
                steps: data.steps as any,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.recipe.delete({
            where: { id },
        });
    }
}
