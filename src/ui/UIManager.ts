export class UIManager {
  private generateCallback: (() => void) | null = null;
  private solveCallback: (() => void) | null = null;
  private themeChangeCallback: ((theme: string) => void) | null = null;
  private animationSpeedCallback: ((speed: number) => void) | null = null;
  private progressBar: HTMLProgressElement | null = null;
  private progressContainer: HTMLDivElement | null = null;
  private progressText: HTMLSpanElement | null = null;

  constructor() {
    this.initializeEventListeners();
    this.initializeProgressBar();
  }

  private initializeProgressBar(): void {
    // Create progress container
    this.progressContainer = document.createElement('div');
    this.progressContainer.className = 'progress-container';
    this.progressContainer.style.display = 'none';

    // Create progress bar
    this.progressBar = document.createElement('progress');
    this.progressBar.className = 'progress-bar';
    this.progressBar.max = 100;
    this.progressBar.value = 0;

    // Create progress text
    this.progressText = document.createElement('span');
    this.progressText.className = 'progress-text';

    // Add elements to container
    this.progressContainer.appendChild(this.progressBar);
    this.progressContainer.appendChild(this.progressText);

    // Add container to app
    const app = document.getElementById('app');
    if (app) {
      app.appendChild(this.progressContainer);
    }
  }

  private initializeEventListeners(): void {
    const generateButton = document.getElementById('generate');
    const solveButton = document.getElementById('solve');
    const mazeSizeInput = document.getElementById('maze-size') as HTMLInputElement;
    const sizeValue = document.getElementById('size-value');
    const themeSelect = document.getElementById('theme') as HTMLSelectElement;
    const animationToggle = document.getElementById('animation-toggle') as HTMLInputElement;
    const animationSpeedInput = document.getElementById('animation-speed') as HTMLInputElement;

    if (generateButton) {
      generateButton.addEventListener('click', () => {
        if (this.generateCallback) {
          this.generateCallback();
        }
      });
    }

    if (solveButton) {
      solveButton.addEventListener('click', () => {
        if (this.solveCallback) {
          this.solveCallback();
        }
      });
    }

    if (mazeSizeInput && sizeValue) {
      mazeSizeInput.addEventListener('input', () => {
        const size = mazeSizeInput.value;
        sizeValue.textContent = `${size}x${size}`;
      });
    }

    if (themeSelect) {
      themeSelect.addEventListener('change', () => {
        if (this.themeChangeCallback) {
          this.themeChangeCallback(themeSelect.value);
        }
      });
    }

    if (animationSpeedInput) {
      animationSpeedInput.addEventListener('input', () => {
        if (this.animationSpeedCallback) {
          this.animationSpeedCallback(parseInt(animationSpeedInput.value, 10));
        }
      });
    }
  }

  public onGenerateClick(callback: () => void): void {
    this.generateCallback = callback;
  }

  public onSolveClick(callback: () => void): void {
    this.solveCallback = callback;
  }

  public onThemeChange(callback: (theme: string) => void): void {
    this.themeChangeCallback = callback;
  }

  public onAnimationSpeedChange(callback: (speed: number) => void): void {
    this.animationSpeedCallback = callback;
  }

  public getMazeSize(): number {
    const input = document.getElementById('maze-size') as HTMLInputElement;
    return parseInt(input.value, 10);
  }

  public getAlgorithm(): string {
    const select = document.getElementById('algorithm') as HTMLSelectElement;
    return select.value;
  }

  public getSpeed(): number {
    const input = document.getElementById('speed') as HTMLInputElement;
    return parseInt(input.value, 10);
  }

  public getAnimationEnabled(): boolean {
    const toggle = document.getElementById('animation-toggle') as HTMLInputElement;
    return toggle?.checked ?? false;
  }

  public getAnimationSpeed(): number {
    const input = document.getElementById('animation-speed') as HTMLInputElement;
    return parseInt(input.value, 10);
  }

  public updateGenerationTime(time: number): void {
    const element = document.getElementById('gen-time');
    if (element) {
      element.textContent = `${Math.round(time)}ms`;
    }
  }

  public updatePathLength(length: number): void {
    const element = document.getElementById('path-length');
    if (element) {
      element.textContent = length.toString();
    }
  }

  public updateNodesExplored(count: number): void {
    const element = document.getElementById('nodes-explored');
    if (element) {
      element.textContent = count.toString();
    }
  }

  public showMessage(message: string, type: 'info' | 'error' | 'success' = 'info'): void {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;

    // Add to document
    document.body.appendChild(messageElement);

    // Remove after 3 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }

  public setLoading(isLoading: boolean, operation: 'generate' | 'solve' = 'generate'): void {
    const generateButton = document.getElementById('generate') as HTMLButtonElement;
    const solveButton = document.getElementById('solve') as HTMLButtonElement;

    if (generateButton) {
      generateButton.disabled = isLoading;
    }
    if (solveButton) {
      solveButton.disabled = isLoading;
    }

    // Show/hide progress bar
    if (this.progressContainer) {
      this.progressContainer.style.display = isLoading ? 'flex' : 'none';
    }

    // Update progress text
    if (this.progressText) {
      this.progressText.textContent = isLoading
        ? operation === 'generate'
          ? 'Generating maze...'
          : 'Solving maze...'
        : '';
    }
  }

  public updateProgress(progress: number): void {
    if (this.progressBar) {
      this.progressBar.value = progress;
    }
  }
} 