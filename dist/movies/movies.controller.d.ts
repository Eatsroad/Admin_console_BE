import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';
export declare class MoviesController {
    readonly movieService: MoviesService;
    constructor(movieService: MoviesService);
    getAll(): Movie[];
    search(searchingYear: string): string;
    getOne(id: number): Movie;
    creat(movieData: CreateMovieDto): void;
    remove(id: number): void;
    patch(id: number, updateData: UpdateMovieDto): void;
}
