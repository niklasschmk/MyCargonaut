import {TestBed} from '@angular/core/testing';
import {Evaluation} from '../model/evaluation';


let evaluation: Evaluation;
describe('EvaluationService', ()=>{
  beforeEach(()=>{
    evaluation = new Evaluation(
      'Ziyad',
      4,
      'Du bist der beste',
      'Ich liebe dich',
      '12',
      null,
      false,
    );
    TestBed.configureTestingModule({});
  });
  afterEach(()=>{
    evaluation = null;
  });
  it('should be created',()=>{
    expect(evaluation).toBeTruthy();
  });

  it('should be found a title', ()=>{
    expect(evaluation.title).toEqual('Ich liebe dich');
  });
  it('should be found an evaluation', ()=>{
    const testevaluation = new Evaluation('Ziyad', 4, 'Du bist der beste', 'Ich liebe dich', '12', null, false);
    expect(evaluation).toEqual(testevaluation);
  });
  it('edited should be false ',()=>{
    expect(evaluation.edited).toBeFalse();
  });
});
