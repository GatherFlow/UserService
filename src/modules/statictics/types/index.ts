import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'

interface IStatisticsService {
	getTotalUsers: () => Promise<number>
}

interface StatisticModuleDependencies {
	statisticsService: IStatisticsService
}

type StatisticsInjectableDependencies =
	InjectableDependencies<StatisticModuleDependencies>

type StatisticsDiConfig = BaseDiConfig<StatisticModuleDependencies>

export type {
	IStatisticsService,
	StatisticModuleDependencies,
	StatisticsDiConfig,
	StatisticsInjectableDependencies,
}
