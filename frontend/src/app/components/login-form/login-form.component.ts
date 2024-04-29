import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    FormGroup,
    FormControl,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@Component({
    selector: "app-login-form",
    standalone: true,
    imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./login-form.component.html",
    styleUrl: "./login-form.component.css",
})
export class LoginFormComponent {
    constructor(private http: HttpClient) {}

    loginForm: FormGroup = new FormGroup({
        email: new FormControl(""),
        password: new FormControl(""),
    });

    onSubmit(event: Event) {
        event.preventDefault();
        console.log(this.loginForm.value);
        this.http
            .post("http://localhost:3000/login", this.loginForm.value, {
                withCredentials: true,
            })
            .subscribe((data) => {
                console.log(data);
            });
    }

    togglePlay(): void {
        const audio: HTMLAudioElement = document.getElementById(
            "audio"
        ) as HTMLAudioElement;
        audio.volume = 1;
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    ngOnInit() {
        document.getElementById("backgroundMusic")?.click();

        interface BackgroundScene {
            canvas: HTMLCanvasElement;
            ctx: CanvasRenderingContext2D;
            backgroundLayers: BackgroundLayers;
            nextBackgroundLayers: BackgroundLayers;
            speeds: Array<number>;
            currentFrame: number;
            slowDown: number;
        }

        interface BackgroundLayers {
            backgroundLayers: Array<{
                name: string;
                width: number;
                height: number;
                image: HTMLImageElement;
                x: number;
                y: number;
            }>;
        }

        class BackgroundLayers {
            constructor() {
                this.backgroundLayers = [
                    {
                        name: "sky",
                        width: 320,
                        height: 240,
                        image: new Image(),
                        x: 0,
                        y: 0,
                    },
                    {
                        name: "far-clouds",
                        width: 128,
                        height: 240,
                        image: new Image(),
                        x: 0,
                        y: 0,
                    },
                    {
                        name: "near-clouds",
                        width: 144,
                        height: 240,
                        image: new Image(),
                        x: 0,
                        y: 0,
                    },
                    {
                        name: "far-mountains",
                        width: 160,
                        height: 240,
                        image: new Image(),
                        x: 0,
                        y: 0,
                    },
                    {
                        name: "mountains",
                        width: 320,
                        height: 240,
                        image: new Image(),
                        x: 0,
                        y: 0,
                    },
                    {
                        name: "trees",
                        width: 240,
                        height: 240,
                        image: new Image(),
                        x: 0,
                        y: 0,
                    },
                ];

                for (let i = 0; i < this.backgroundLayers.length; i++) {
                    this.backgroundLayers[
                        i
                    ].image.src = `../../../assets/images/backgrounds/mountains/${this.backgroundLayers[i].name}.png`;
                }
            }
            update(speeds: Array<number>, canvas: HTMLCanvasElement) {
                for (let i = 0; i < this.backgroundLayers.length; i++) {
                    this.backgroundLayers[i].x -= speeds[i];
                    if (this.backgroundLayers[i].x <= -canvas.width) {
                        this.backgroundLayers[i].x = 0;
                    }
                }
            }
            draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
                for (let i = 0; i < this.backgroundLayers.length; i++) {
                    ctx.drawImage(
                        this.backgroundLayers[i].image,
                        0,
                        0,
                        this.backgroundLayers[i].width,
                        this.backgroundLayers[i].height,
                        this.backgroundLayers[i].x,
                        this.backgroundLayers[i].y,
                        canvas.width,
                        canvas.height
                    );
                    ctx.drawImage(
                        this.backgroundLayers[i].image,
                        0,
                        0,
                        this.backgroundLayers[i].width,
                        this.backgroundLayers[i].height,
                        this.backgroundLayers[i].x + canvas.width,
                        this.backgroundLayers[i].y,
                        canvas.width,
                        canvas.height
                    );
                }
            }
        }

        class BackgroundScene {
            constructor() {
                this.canvas = document.getElementById(
                    "backgroundScene"
                ) as HTMLCanvasElement;
                this.ctx = this.canvas.getContext(
                    "2d"
                ) as CanvasRenderingContext2D;
                this.canvas.height = document.body.clientHeight;
                this.canvas.width = document.body.clientWidth;
                this.canvas.style.position = "absolute";
                this.canvas.style.zIndex = "-1";
                this.backgroundLayers = new BackgroundLayers();
                this.currentFrame = 1;
                this.slowDown = 7;
                this.speeds = [0, 2, 4, 6, 8, 10];
            }
            animate() {
                this.currentFrame++;
                if (this.currentFrame % this.slowDown === 0) {
                    this.ctx.clearRect(
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height
                    );
                    this.backgroundLayers.update(this.speeds, this.canvas);
                    this.backgroundLayers.draw(this.ctx, this.canvas);
                    this.currentFrame = 1;
                }
                requestAnimationFrame(() => this.animate());
            }
        }
        const background: BackgroundScene = new BackgroundScene();
        background.animate();

        window.addEventListener("resize", () => {
            background.canvas.height = document.body.clientHeight;
            background.canvas.width = document.body.clientWidth;
        });
    }
}
