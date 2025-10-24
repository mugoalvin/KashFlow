package com.mugoalvin.KashFlow.SmsReader

import com.facebook.react.bridge.*
import android.content.ContentResolver
import android.database.Cursor
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.text.SimpleDateFormat
import java.util.Locale
import androidx.core.net.toUri
import java.util.Calendar

class SmsReaderModule(private val reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "SmsReader"
    }

    @ReactMethod
    fun getLatestMessages(sender: String, lastId: Int, promise: Promise) {
        try {
            val smsUri = "content://sms/inbox".toUri();
            val resolver: ContentResolver = reactContext.contentResolver

            val cursor: Cursor? = resolver.query(
                smsUri,
                arrayOf("_id", "address", "body", "date"),
                "_id > ? AND address LIKE ?",
                arrayOf(lastId.toString(), "%$sender%"),
                "date ASC"
            )

            val messages = WritableNativeArray()
            var count = 0

            cursor?.use {
                val idIdx = it.getColumnIndex("_id")
                val addressIdx = it.getColumnIndex("address")
                val bodyIdx = it.getColumnIndex("body")
                val dateIdx = it.getColumnIndex("date")

                while (it.moveToNext()) {
                    val msg = WritableNativeMap()
                    msg.putString("id", it.getString(idIdx))
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
                val idIdx = it.getColumnIndex("_id")
                val addressIdx = it.getColumnIndex("address")
                val bodyIdx = it.getColumnIndex("body")
                val dateIdx = it.getColumnIndex("date")

                while (it.moveToNext() && count < limit) {
                    val msg = WritableNativeMap()
                    msg.putString("id", it.getString(idIdx))
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
                arrayOf("_id", "address", "body", "date"),
                "address LIKE ? AND date BETWEEN ? AND ?",
                arrayOf("%$sender%", startTime.toString(), endTime.toString()),
                "date DESC"
            )

            val messages = WritableNativeArray()

            cursor?.use {
                val idIdx = it.getColumnIndex("_id")
                val addressIdx = it.getColumnIndex("address")
                val bodyIdx = it.getColumnIndex("body")
                val dateIdx = it.getColumnIndex("date")

                while (it.moveToNext()) {
                    val msg = WritableNativeMap()
                    msg.putString("id", it.getString(idIdx))
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

    @ReactMethod
    fun getMonthlyTransactions(sender: String, month: String, promise: Promise) {
        try {
            val smsUri = "content://sms/inbox".toUri()
            val resolver: ContentResolver = reactContext.contentResolver
            val sdf = SimpleDateFormat("yyyy-MM", Locale.getDefault())
            val parsedMonth = sdf.parse(month)

            if (parsedMonth == null) {
                promise.reject("INVALID_MONTH", "Invalid month format. Use yyyy-MM (e.g. 2025-10)")
                return
            }

            val startCal = Calendar.getInstance().apply {
                time = parsedMonth
                set(Calendar.DAY_OF_MONTH, 1)
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }

            val endCal = startCal.clone() as Calendar
            endCal.add(Calendar.MONTH, 1)

            val startTime = startCal.timeInMillis
            val endTime = endCal.timeInMillis

            val cursor: Cursor? = resolver.query(
                smsUri,
                arrayOf("_id", "address", "body", "date"),
                "address LIKE ? AND date BETWEEN ? AND ?",
                arrayOf("%$sender%", startTime.toString(), endTime.toString()),
                "date DESC"
            )

            val messages = WritableNativeArray()

            cursor?.use {
                val idIdx = it.getColumnIndex("_id")
                val addressIdx = it.getColumnIndex("address")
                val bodyIdx = it.getColumnIndex("body")
                val dateIdx = it.getColumnIndex("date")

                while(it.moveToNext()) {
                    val msg = WritableNativeMap()
                    msg.putString("id", it.getString(idIdx))
                    msg.putString("address", it.getString(addressIdx))
                    msg.putString("body", it.getString(bodyIdx))
                    msg.putString("date", it.getString(dateIdx))
                    messages.pushMap(msg)
                }
            }

            promise.resolve(messages)
        }
        catch (e: Exception) {
            promise.reject("SMS_READ_ERROR", e.message);
        }
    }
}