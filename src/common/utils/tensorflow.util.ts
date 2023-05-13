import { Logger, Injectable } from '@nestjs/common'
import * as tf from '@tensorflow/tfjs-node'

@Injectable()
export class TensorflowUtil {

  private tensorflowModel
  private logger

  constructor() {
    this.logger = new Logger('Tensorflow')
  }

  public initTensorflowModel = (): void => {
    this.logger.log('Obtaining Tensorflow model...')

    if(this.tensorflowModel) {
      this.logger.log('Tensorflow model loaded from memory')
    }

    this.tensorflowModel = tf.sequential()
    this.tensorflowModel.add(
      tf.layers.dense({ 
        inputShape: [ 2 ],
        units: 64,
        activation: 'relu'
      })
    )
    this.tensorflowModel.add(
      tf.layers.dense({
        units: 64,
        activation: 'relu'
      })
    )
    this.tensorflowModel.add(
      tf.layers.dense({
        units: 1,
        activation: 'linear'
      })
    )
    this.logger.log('Tensorflow model created')
  }

  public trainTensorflowModel = async (data: Array<{ sets, reps, weight }>) => {
    const repetitions = data.map(d => d.reps)
    const sets = data.map(d => d.sets)
    const weights = data.map(d => d.weight)

    this.logger.log('Compiling Tensorflow model...')

    this.tensorflowModel.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
    });

    this.logger.log('Tensorflow model compiled!')
    this.logger.log('Training Tensorflow model...')

    const inputs = tf.tensor2d([repetitions, sets], [2, repetitions.length]).transpose().div(tf.scalar(10))
    const labels = tf.tensor2d(weights, [weights.length, 1]).div(tf.scalar(100))
    await this.tensorflowModel.fit(
      inputs,
      labels,
      { epochs: 500, validationSplit: 1, verbose: 0 }
    );
  }

  public predictAthleteWeight = async (dataset, inputData) => {
    await this.initTensorflowModel()
    await this.trainTensorflowModel(dataset)
    this.logger.log('Predicting athlete performance...')
    const { reps, sets } = inputData
    const result = this.tensorflowModel.predict(tf.tensor2d([ reps, sets ], [1, 2]).div(tf.scalar(10)))
    return Number.parseInt(`${ result.dataSync()[0] * 100 }`)
  }
}