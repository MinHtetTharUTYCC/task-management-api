import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';

class CreateUserDto {
  name: string;
  age: number;
  email: string;
}

class SearchQueryDto {
  keyword?: string;
  page?: string;
  limit?: string;
}

export class BMIDetailsDto {
  weight: number;
  height: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hi/:name')
  sayHi(@Param('name') name: string): string {
    return this.appService.sayHi(name)
  }

  @Get('age/:numAge')
  sayAge(@Param('numAge', ParseIntPipe) numAge: number): string {
    return this.appService.sayAge(numAge)
  }


  // @Get('user/:id/post/:postId')
  // getUserPost(@Param('id', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number): object {
  //   return this.appService.getUserPost(userId, postId)
  // }

  // @Get('search')
  // search(@Query() query: SearchQueryDto): object {
  //   return this.appService.search(query)
  // }

  @Get('filter')
  filter(@Query('status') status: string, @Query('page', ParseIntPipe) page: number = 1): object {
    return { status, page }
  }

  // POST/PUT/PATCH
  // @Post("users")
  // @HttpCode(HttpStatus.CREATED) //custom status code
  // creatUser(@Body() createUserDto: CreateUserDto): object {
  //   return this.appService.createUser(createUserDto)
  // }

  // //with validation Pipe
  // @Post("users/validated")
  // creatUserValidated(@Body(ValidationPipe) createUserDto: CreateUserDto): object {
  //   return this.appService.createUser(createUserDto)
  // }


  // Combined parasm,query and body
  @Post('users/:id/comments')
  addComment(@Param('id', ParseIntPipe) userId: number, @Query('notify') notify: string, @Body() body: { text: string }) {
    return {
      userId,
      notify: notify === 'true',
      comment: body.text,
    }
  }

  //return status codes
  // @Post('login')
  // @HttpCode(HttpStatus.OK) //200
  // login(@Body() credentials: { username: string; password: string }): object {
  //   return this.appService.login(credentials)
  // }

  //async operations
  // @Get('async-data')
  // async getAsyncData(): Promise<object> {
  //   return this.appService.fetchDataAsync();
  // }

  // @Get('users/:id/async')
  // async getUserAsync(@Param('id', ParseIntPipe) userId: number): Promise<object> {
  //   return this.appService.getUserById(userId)
  // }

  // @Get('error-demo/:type')
  // errorDemo(@Param('type') type: string): string {
  //   return this.appService.demonstrateError(type)
  // }

  //examples
  @Get('calculate-age/:birthYear')
  calculateAge(@Param('birthYear', ParseIntPipe) birthYear: number): number {
    return this.appService.calculateAge(birthYear)
  }

  // @Get('weather/:city')
  // getWeather(@Param('city') city: string): object {
  //   return this.appService.getWeather(city)
  // }

  // //pagination
  // @Get('posts')
  // getPosts(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10): object {
  //   return this.appService.getPaginatedPosts(page, limit)
  // }

  @Get('custom-header')
  @Header('X-Custom-Header', 'NestJS-Learning')
  @Header('Cache-Control', 'no-cache')
  withCustomHeader(): string {
    return 'Check the response headers!';
  }



  // BMI
  @Post('health/bmi')
  calculateBMI(@Body() bmiDetailsDto: BMIDetailsDto): object {
    return this.appService.calculateBMI(bmiDetailsDto)
  }


  // TEST
  @Get('text/reverse/:text')
  reverseText(@Param('text') text: string) {
    return this.appService.reverseText(text)
  }
  @Get('text/uppercase/:text')
  uppercase(@Param('text') text: string) {
    return this.appService.uppercase(text)
  }
  @Get('text/count/:text')
  count(@Param('text') text: string) {
    return this.appService.count(text)
  }
  @Get('text/analyze/:text')
  analyze(@Param('text') text: string) {
    return this.appService.analyzeText(text)
  }
  @Get('text/palindrome/:text')
  isPalindrome(@Param('text') text: string) {
    return this.appService.isPalindrome(text)
  }

  @Get('text/titleCase/:text')
  titleCase(@Param('text') text: string) {
    return this.appService.titleCase(text)
  }

  @Get('text/removeDuplicate/:text')
  removeDuplicate(@Param('text') text: string) {
    return this.appService.removeDuplicate(text)
  }
  @Get('text/mostFrequentChar/:text')
  mostFrequentChar(@Param('text') text: string) {
    return this.appService.mostFrequentChar(text)
  }



}
