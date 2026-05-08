import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuario.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsuariosService } from "./services/usuarios.service";
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./guards/auth.guard";

@Module({
    controllers: [AuthController],
    providers: [UsuariosService, AuthService, AuthGuard],
    imports: [TypeOrmModule.forFeature([Usuario]),
    JwtModule.registerAsync({
        inject: [ConfigService],
        global: true,
        useFactory: (configService: ConfigService) => {
            return {
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '8h' },
            }
        },
    })
    ,],
    exports: [AuthGuard]
})
export class AuthModule {

}