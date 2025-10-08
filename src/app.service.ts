import { BadRequestException, Injectable } from '@nestjs/common';
import { BMIDetailsDto } from './app.controller';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  sayHi(name: string): string {
    return `Hi, ${name}`
  }
  sayAge(numAge: number): string {
    return `I am ${numAge} years old.`
  }

  calculateAge(birthYear: number): number {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  }

  calculateBMI(bmiDetailsDto: BMIDetailsDto): { bmi: number; status: string } {
    const { weight, height } = bmiDetailsDto;

    if (!weight || !height || height <= 0 || weight <= 0) {
      return { bmi: NaN, status: 'Invalid' }
    }

    const bmi = weight / (height * height)

    let status: string;

    if (bmi < 18.5) {
      status = "Underweight"
    } else if (bmi < 25) {
      status = "Healthy weight"
    } else if (bmi < 29.9) {
      status = "Overweight"
    } else {
      status = "Obesity"
    }

    return {
      bmi: Number(bmi.toFixed(2)),
      status,
    }
  }

  reverseText(text: string): string {
    // let newText: string = '';
    // const length = text.length;

    // for (let l = length - 1; l >= 0; l--) {
    //   const char = text[l]
    //   newText += char;
    // }
    // return newText;

    if (!text) {
      throw new BadRequestException("Text cannot be empty")
    }
    return text.split('').reverse().join()
  }

  uppercase(text: string): string {
    if (!text || text.trim().length === 0) {
      throw new BadRequestException("Text cannot be empty")
    }
    return text.toUpperCase()
  }

  // vowels and consonants
  count(text: string): { vowels: number, consonants: number, spaces: number, digits: number; specials: number; total: number; } {
    if (!text) {
      throw new BadRequestException("Text cannot be empty")
    }

    const vowelCount = (text.match(/[aeiou]/gi) || []).length;
    const consonantCount = (text.match(/[bcdfghjklmnpqrstuvwxyz]/gi) || []).length
    const spaceCount = (text.match(/\s/g) || []).length;
    const digitCount = (text.match(/\d/g) || []).length;
    const specialCount = (text.length - vowelCount - consonantCount - spaceCount - digitCount);

    return {
      vowels: vowelCount,
      consonants: consonantCount,
      spaces: spaceCount,
      digits: digitCount,
      specials: specialCount,
      total: text.length,
    }
  }

  analyzeText(text: string): object {
    if (!text) {
      throw new BadRequestException("Text cannot be empty")
    }

    const counts = this.count(text);
    const words = text.trim().split(/\s+/)
    const wordsCount = words.filter(w => w.length > 0).length;

    const longestWord = words.reduce((longest, current) => {
      return current.length > longest.length ? current : longest;
    })

    const totalWordLength = words.reduce((sum, word) => sum + word.length, 0)
    const avgWorkLenght = wordsCount > 0 ? totalWordLength / wordsCount : 0;

    return { counts, words, wordsCount, longestWord, totalWordLength, avgWorkLenght }
  }

  isPalindrome(text: string): boolean {
    const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '')
    return cleaned === cleaned.split('').reverse().join('')
  }

  titleCase(text: string): string {
    return text.toLowerCase().split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
  }

  removeDuplicate(text: string): string {
    return [...new Set(text)].join('')
  }

  mostFrequentChar(text: string): { char: string; count: number } {

    let frequency: Record<string, number> = {}
    let maxChar = '';
    let maxCount = 0;

    for (const char of text) {
      if (char === ' ') continue;

      frequency[char] = (frequency[char] || 0) + 1;

      if (frequency[char] > maxCount) {
        maxCount = frequency[char]
        maxChar = char;
      }

    }

    return { char: maxChar, count: maxCount }
  }


}
