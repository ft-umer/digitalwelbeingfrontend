package com.digitalwelbeing

import android.app.usage.UsageStatsManager
import android.content.Context
import com.facebook.react.bridge.*
import java.util.*

class UsageModule(private val reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "UsageModule"

    @ReactMethod
    fun getTodayUsage(promise: Promise) {
        try {
            val usageStatsManager =
                reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val endTime = System.currentTimeMillis()

            val calendar = Calendar.getInstance()
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)

            val startTime = calendar.timeInMillis

            val stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )

            val result = Arguments.createArray()

            for (usage in stats) {
                if (usage.totalTimeInForeground > 0) {
                    val map = Arguments.createMap()
                    map.putString("packageName", usage.packageName)
                    map.putDouble("usageTime", usage.totalTimeInForeground.toDouble())
                    map.putDouble("lastTimeUsed", usage.lastTimeUsed.toDouble())
                    result.pushMap(map)
                }
            }

            promise.resolve(result)

        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}