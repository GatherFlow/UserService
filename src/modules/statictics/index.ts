import { asClass } from 'awilix'
import type { StatisticsDiConfig } from './types/index.js'
import { StatisticsService } from './services/StatisticsService.js'

export const resolveStatisticsModule = (): StatisticsDiConfig => ({
	statisticsService: asClass(StatisticsService).singleton(),
})
