package com.mugoalvin.KashFlow.SmsReader

import com.facebook.react.bridge.*
import android.content.ContentResolver
import android.database.Cursor
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.text.SimpleDateFormat
import java.util.Locale
import androidx.core.net.toUri

class SmsReaderModule(private val reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "SmsReader"
    }

    @ReactMethod
    fun testModule(promise: Promise) {
        promise.resolve("Hello From Kotlin Once Again")
    }

    @ReactMethod
    fun getInboxFiltered(sender: String, limit: Int, promise: Promise) {
        try {
            val smsUri = "content://sms/inbox".toUri()
            val resolver: ContentResolver = reactContext.contentResolver

            val cursor: Cursor? = resolver.query(
                smsUri,
                arrayOf("_id", "address", "body", "date"),
                "address LIKE ?",
                arrayOf("%$sender%"),
                "date DESC"
            )

            val messages = WritableNativeArray()
            var count = 0

            cursor?.use {
                val addressIdx = it.getColumnIndex("address")
                val bodyIdx = it.getColumnIndex("body")
                val dateIdx = it.getColumnIndex("date")

                while (it.moveToNext() && count < limit) {
                    val msg = WritableNativeMap()
                    msg.putString("address", it.getString(addressIdx))
                    msg.putString("body", it.getString(bodyIdx))
                    msg.putString("date", it.getString(dateIdx))
                    messages.pushMap(msg)
                    count++
                }
            }

            promise.resolve(messages)
        }
        catch (e: Exception) {
            promise.reject("SMS_READER_ERROR", e.message);
        }
    }


    @ReactMethod
    fun getInboxFilteredByDate(sender: String, date: String, promise: Promise) {
        try {
            val smsUri = "content://sms/inbox".toUri()
            val resolver: ContentResolver = reactContext.contentResolver
            val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val targetDate = sdf.parse(date)
            val startTime = targetDate?.time ?: 0L
            val endTime = startTime + (24 * 60 * 60 * 1000) // one day later

            val cursor: Cursor? = resolver.query(
                smsUri,
                arrayOf("address", "body", "date"),
                "address LIKE ? AND date BETWEEN ? AND ?",
                arrayOf("%$sender%", startTime.toString(), endTime.toString()),
                "date DESC"
            )

            val messages = WritableNativeArray()

            cursor?.use {
                val addressIdx = it.getColumnIndex("address")
                val bodyIdx = it.getColumnIndex("body")
                val dateIdx = it.getColumnIndex("date")

                while (it.moveToNext()) {
                    val msg = WritableNativeMap()
                    msg.putString("address", it.getString(addressIdx))
                    msg.putString("body", it.getString(bodyIdx))
                    msg.putString("date", it.getString(dateIdx))
                    messages.pushMap(msg)
                }
            }

            promise.resolve(messages)
        } catch (e: Exception) {
            promise.reject("SMS_READ_ERROR", e.message)
        }
    }
}