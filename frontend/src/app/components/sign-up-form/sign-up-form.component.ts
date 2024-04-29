import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import {
    FormGroup,
    FormControl,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";

import { HttpClient, HttpClientModule } from "@angular/common/http";

@Component({
    selector: "app-sign-up-form",
    standalone: true,
    imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./sign-up-form.component.html",
    styleUrl: "./sign-up-form.component.css",
})
export class SignUpFormComponent {
    constructor(private http: HttpClient) {}

    signUpForm: FormGroup = new FormGroup({
        name: new FormControl(""),
        email: new FormControl(""),
        password: new FormControl(""),
    });

    onSubmit(event: Event) {
        event.preventDefault();
        console.log(this.signUpForm.value);
        const toSend = JSON.stringify(this.signUpForm.value);
        this.http
            .post("http://localhost:3000/register", toSend, {
                withCredentials: true,
                headers: { "Content-Type": "text/html" },
            })
            .subscribe((data) => {
                console.log(data);
            });
    }

    togglePlay(): void {
        const audio: HTMLAudioElement = document.getElementById(
            "audio"
        ) as HTMLAudioElement;
        audio.volume = 0.2;
        console.log(audio);
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
                        name: "far",
                        width: 256,
                        height: 192,
                        image: new Image(),
                        x: 0,
                        y: 0,
                    },
                    {
                        name: "sand",
                        width: 256,
                        height: 192,
                        image: new Image(),
                        x: 0,
                        y: 0,
                    },
                    {
                        name: "foreground-2",
                        width: 256,
                        height: 192,
                        image: new Image(),
                        x: 0,
                        y: 0,
                    },
                    {
                        name: "foreground-1",
                        width: 256,
                        height: 192,
                        image: new Image(),
                        x: 0,
                        y: 0,
                    },
                ];

                for (let i = 0; i < this.backgroundLayers.length; i++) {
                    this.backgroundLayers[
                        i
                    ].image.src = `../../../assets/images/backgrounds/underwater/${this.backgroundLayers[i].name}.png`;
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
                this.speeds = [2, 4, 6, 8];
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
