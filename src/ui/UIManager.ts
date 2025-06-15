export class UIManager {
  private generateCallback: (() => void) | null = null;
  private solveCallback: (() => void) | null = null;

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    const generateButton = document.getElementById('generate');
    const solveButton = document.getElementById('solve');
    const mazeSizeInput = document.getElementById('maze-size') as HTMLInputElement;
    const sizeValue = document.getElementById('size-value');

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
  }

  public onGenerateClick(callback: () => void): void {
    this.generateCallback = callback;
  }

  public onSolveClick(callback: () => void): void {
    this.solveCallback = callback;
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

  public setLoading(isLoading: boolean): void {
    const generateButton = document.getElementById('generate') as HTMLButtonElement;
    const solveButton = document.getElementById('solve') as HTMLButtonElement;

    if (generateButton) {
      generateButton.disabled = isLoading;
    }
    if (solveButton) {
      solveButton.disabled = isLoading;
    }
  }
} 