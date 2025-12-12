import { CommonModule } from "@angular/common";
import { Component, input, OnInit } from "@angular/core";

@Component({
    selector: "app-splash",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./splash.component.html",
    styleUrls: ["./splash.component.scss"],
})
export class SplashComponent implements OnInit {
    public type = input<"base" | "warning" | "error">("base");
    public message = input<string>("");

    public ngOnInit(): void {
        this.generateSakura(25);
    }

    generateSakura(count: number) {
        const container = document.querySelector('.sakura-rain');
        const water = document.querySelector('.water-surface');
        if (!container || !water) return;

        for (let i = 0; i < count; i++) {
            const petal = document.createElement('span');
            petal.classList.add('petal');

            const duration = 8 + Math.random() * 6;
            const delay = Math.random() * 5;

            petal.style.top = -(20 + Math.random() * 40) + "px";
            petal.style.left = Math.random() * 100 + "%";
            petal.style.animationDelay = delay + "s";
            petal.style.animationDuration = duration + "s";
            petal.style.opacity = (0.3 + Math.random() * 0.4).toString();

            container.appendChild(petal);

            setTimeout(() => {
                const ripple = document.createElement('div');
                ripple.classList.add('ripple');

                ripple.style.left = petal.style.left;

                water.appendChild(ripple);

                setTimeout(() => ripple.remove(), 2000);

            }, (delay + duration) * 1000);
        }
    }
}
